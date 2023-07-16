import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { NextRequest } from 'next/server';
import setResponse from '~/helper/response-api';
import prisma from '~/prisma/prisma';

// for delete correct answers question when users clear question history from localstorage
export async function DELETE(req: NextRequest) {
  const userId = req.cookies.get('auth_id')?.value;

  if (!userId) {
    return setResponse<null>({ status_code: 401, error: 'Auth id not found', data: null });
  }

  try {
    await prisma.correctAnswers.delete({ where: { userId } });
    return setResponse<string>({ status_code: 200, error: '', data: 'Success delete correct answers key' });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      console.error(error.code + ' : ' + error.message);
      return setResponse<null>({ status_code: 500, error: 'Failed to delete correct answers key', data: null });
    }

    const err = error as Error;
    console.error(err.message);

    return setResponse<null>({ status_code: 500, error: 'Runtime error when delete correct answers key', data: null });
  }
}
