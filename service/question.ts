import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RedirectType } from 'next/dist/client/components/redirect';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { QuestionList, Quiz } from '~/types/quiz';
import prisma from '~/prisma/prisma';

type FetchQuestionData = { expired: number; questions: QuestionList[]; error: string; isFinished: boolean };

export default async function fetchQuestions(): Promise<FetchQuestionData> {
  const userId = cookies().get('auth_id')?.value;
  if (!userId) redirect('/', RedirectType.replace);

  const user = await prisma.users.findUnique({ where: { id: userId } });

  if (!user) redirect('/', RedirectType.replace);

  try {
    const isQuisNotCompleteYet = await prisma.correctAnswers.findUnique({
      where: { userId: user.id },
    });

    // when quiz not finished and expired yet
    if (isQuisNotCompleteYet && isQuisNotCompleteYet.expired.getTime() > new Date().getTime()) {
      return {
        expired: isQuisNotCompleteYet.expired.getTime(),
        questions: [],
        error: 'Quiz not finished yet',
        isFinished: false,
      };
    }

    // delete correct answer from db when quiz is expired
    if (isQuisNotCompleteYet) {
      await prisma.correctAnswers.delete({
        where: { userId: user.id },
      });
    }

    const resp = await fetch(process.env.API_QUIZ!, {
      method: 'GET',
      cache: 'no-store',
      headers: {
        Accept: 'application/json',
      },
    });
    if (!resp.ok) {
      return { expired: 0, questions: [], error: 'Failed to fetch question', isFinished: true };
    }

    const questionsData = (await resp.json()).results as Quiz[];

    const answersData = [] as Prisma.JsonArray;

    questionsData.forEach((q, i) => {
      answersData.push({ [i + 1]: q.correct_answer });
    });

    // erpired in 10 minutes after fetch quiz
    const exp = new Date();
    exp.setMinutes(exp.getMinutes() + 10);

    await prisma.correctAnswers.create({
      data: {
        userId: user.id,
        expired: exp,
        answersData: {
          [user.id]: answersData,
        },
      },
    });

    const questionList: QuestionList[] = questionsData.map((q, i) => {
      return {
        number: i + 1,
        question: q.question,
        answer: [...q.incorrect_answers, q.correct_answer],
      };
    });

    // return expired as number to avoid react hydration error
    return { expired: exp.getTime(), questions: questionList, error: '', isFinished: true };
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.log(error.code + ' : ' + error.message);

      return { expired: 0, questions: [], error: error.message, isFinished: true };
    }

    const err = error as Error;
    console.log(err.message);

    return { expired: 0, questions: [], error: 'Failed to save question', isFinished: true };
  }
}
