import { cookies } from 'next/headers';
import { AiFillGithub } from 'react-icons/ai';
import { GiBrain } from 'react-icons/gi';
import SigninForm from '~/app/_components/SignInForm';
import Leaderboard from './_components/Leaderboard';
import Link from 'next/link';
import prisma from '~/prisma/prisma';
import SignoutBtn from './_components/SignOutBtn';
import Faqs from './_components/Faq';

export const revalidate = 0;

const linkStyle = 'w-fit block mx-auto mt-5 text-sm px-5 py-1 rounded bg-purple-600 text-white';

export default async function Home() {
  const users = await prisma.users.findMany({
    select: {
      name: true,
      score: true,
    },
    orderBy: { score: 'desc' },
    take: 10,
  });

  const isAuth = cookies().get('auth_key')?.value;
  const userId = cookies().get('auth_id')?.value;

  return (
    <main className="px-5 pt-5 min-h-screen">
      <header className="md:w-[80%] mx-auto flex justify-between items-center">
        <div className="flex items-center text-xl gap-x-1">
          <GiBrain className="fill-purple-700 rotate-45" />
          <h1 className="font-bold text-gray-700">Quiz App</h1>
        </div>

        <div className="flex items-center gap-x-3 text-sm">
          <Link href="#faqs">FAQs</Link>
          {isAuth && userId && <SignoutBtn />}
        </div>
      </header>

      <div className="mt-14">
        <h2 className="text-center font-bold text-3xl text-transparent bg-gradient-to-br bg-clip-text from-purple-900 via-purple-800 to-purple-900">
          Answer Random Questions and Be a Winner.
        </h2>
        {isAuth && userId ? (
          <a href="/quiz" className={linkStyle}>
            Solved Quiz Now
          </a>
        ) : (
          <Link href="#email" className={linkStyle}>
            Try now
          </Link>
        )}

        <Leaderboard leaderboard={users} />

        {!isAuth && (
          <div className="mt-16">
            <h2 className="text-center text-xl font-semibold text-gray-700 mb-5">SignIn With Email</h2>
            <SigninForm />
          </div>
        )}
      </div>

      <Faqs />

      <footer className="mt-14 flex items-center justify-between w-full md:w-3/5 mx-auto border-t border-purple-200 py-5 text-gray-400 text-xs">
        <p>
          © Copyright 2023 <span className="font-semibold">Izzul Ma'ali</span>.
        </p>

        <Link href="https://github.com/izzul-ali/quiz-app" title="Github">
          <AiFillGithub className="text-lg mr-1" />
        </Link>
      </footer>
    </main>
  );
}
