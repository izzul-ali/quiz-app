import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest, NextResponse } from 'next/server';
import { QuizHistory, QuizResultData } from '~/types/quiz';
import setResponse, { ResponseApi } from '~/helper/response-api';
import prisma from '~/prisma/prisma';

// handle submit quiz
export async function POST(req: NextRequest) {
  const userId = req.cookies.get('auth_id')?.value;

  if (!userId) {
    return setResponse<null>({ status_code: 401, error: 'Unauthorization', data: null });
  }

  try {
    const userAnswersData = (await req.json()) as { isTimeout: boolean; answers: string };
    const userAnswers: QuizHistory[] = JSON.parse(userAnswersData?.answers || '[]');

    if (!userAnswersData || (!userAnswersData.isTimeout && userAnswers?.length < 1)) {
      return setResponse<null>({ status_code: 400, error: 'Please answers question first', data: null });
    }

    const answersKey = await prisma.correctAnswers.findUnique({
      where: { userId },
    });

    if (!answersKey || !answersKey.answersData) {
      return setResponse<null>({ status_code: 404, error: 'Answer key not found', data: null });
    }

    const correctAnswersUserId = answersKey.answersData as Prisma.JsonObject;

    if (!Object.hasOwn(correctAnswersUserId, userId)) {
      return setResponse<null>({ status_code: 404, error: 'Failed to get correct answers data', data: null });
    }

    const correctAnswersKey = correctAnswersUserId[userId] as Array<any>;

    let correctAnswers: number = 0;

    // calculate correct answers
    const calculateCorrectAnswers = (): Promise<unknown> => {
      return new Promise((resolve) =>
        resolve(
          userAnswers.forEach((v) => {
            correctAnswersKey?.forEach((ansKey) => {
              if (ansKey[v.questionNumber.toString()] === v.answer) {
                correctAnswers++;
                return;
              }
            });
          })
        )
      );
    };

    await calculateCorrectAnswers();

    // delete correct answers from db
    await prisma.correctAnswers.delete({ where: { userId: userId } });

    // get previous user score
    const user = await prisma.users.findUnique({ where: { id: userId } });
    if (!user) {
      const resp = NextResponse.json({ status_code: 404, error: 'User not found', data: null } as ResponseApi<null>, {
        status: 404,
      });

      resp.cookies.delete('auth_key');
      resp.cookies.delete('auth_id');

      return resp;
    }

    // update user score
    const updatedUserScore = await prisma.users.update({
      where: { id: userId },
      data: { score: user.score + correctAnswers * 100 },
    });

    return setResponse<QuizResultData>({
      status_code: 200,
      error: '',
      data: {
        username: user.name,
        wrongAnswers: 10 - correctAnswers, // amount questions is 10
        score: updatedUserScore.score,
        correctAnswers,
      },
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code + ': ' + error.message);

      return setResponse<null>({ status_code: 500, error: error.message, data: null });
    }

    const err = <Error>error;
    console.error('Runtime error: ' + err.message);

    return setResponse<null>({ status_code: 500, error: err.message, data: null });
  }
}
