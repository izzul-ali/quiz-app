'use server';

import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { RedirectType } from 'next/dist/client/components/redirect';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { User } from '~/types/user';
import { generateToken } from './jwt';
import prisma from '~/prisma/prisma';
import sendEmailVerification from './email';

type ErrorServerResponse = { error: string };

export async function signinEmail(data: FormData): Promise<ErrorServerResponse | undefined> {
  const email = data.get('email')?.toString();

  if (!email) {
    return { error: 'Email is required' };
  }

  const randomString = () => {
    const numbers = '0123456789';

    let rand: string = '';

    for (let i = 0; i < 6; i++) {
      rand += numbers[Math.floor(Math.random() * numbers.length)];
    }

    return rand;
  };

  try {
    const code = randomString();
    const currentTime = new Date();

    // expired in 5 minutes
    currentTime.setMinutes(currentTime.getMinutes() + 5);

    await prisma.verification.create({
      data: { email, code, expired: currentTime },
    });

    await sendEmailVerification(email, code);
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return { error: err.message };
  }
}

export async function codeVerification(data: FormData): Promise<ErrorServerResponse | undefined> {
  const code = data.get('code')?.toString();

  if (!code || code.length < 6) {
    return { error: 'Invalid OTP input' };
  }

  try {
    const match = await prisma.verification.findUnique({ where: { code } });
    if (!match) {
      return { error: 'OTP number not found' };
    }

    const isExpied = new Date().getTime() > match.expired.getTime();
    if (isExpied) {
      await prisma.verification.deleteMany({ where: { email: match.email } });
      return { error: 'OTP number was expired' };
    }

    let user: User | null = null;

    user = await prisma.users.findUnique({
      where: { email: match.email },
    });

    if (!user) {
      user = await prisma.users.create({
        data: { email: match.email, name: match.email.split('@')[0] || 'unnamed' },
      });
    }

    // delete code verification from db after users success verify their code
    await prisma.verification.deleteMany({ where: { email: match.email } });

    const token = generateToken(user.id, user.email);

    cookies().set('auth_key', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });

    cookies().set('auth_id', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60,
    });
  } catch (error) {
    if (error instanceof PrismaClientKnownRequestError) {
      return { error: error.message };
    }

    const err = <Error>error;
    console.log(err.stack || err.message);

    return { error: err.message };
  }

  // if redirect inside try catch block, the error NEXT_REDIRECT will be show
  redirect('/quiz', RedirectType.push);
}
