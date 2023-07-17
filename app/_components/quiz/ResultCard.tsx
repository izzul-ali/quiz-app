'use client';

import { AiOutlineCheckCircle, AiOutlineCloseCircle } from 'react-icons/ai';
import { GiBrain } from 'react-icons/gi';
import { MdSportsScore } from 'react-icons/md';
import { FiArrowUpRight } from 'react-icons/fi';
import { BiUserCircle } from 'react-icons/bi';
import { useResultQuiz } from './ResultContext';
import Layout from './Layout';
import Link from 'next/link';

export default function ResultCard() {
  const { resultData } = useResultQuiz();
  return (
    <Layout>
      <div className="w-full flex selection:bg-transparent">
        <div className="flex flex-col items-center justify-center w-2/5">
          <GiBrain className="fill-purple-700 rotate-45 text-5xl" />
          <h1 className="font-semibold text-sm text-gray-700">Quiz App</h1>
        </div>

        <div className="w-3/5">
          <ul className="space-y-4 font-semibold">
            <li className="flex items-center gap-x-2">
              <BiUserCircle className="text-2xl text-purple-800" />
              <div className=" flex items-center w-full gap-x-3">
                <p className="text-gray-600">Name:</p>
                <p className="text-gray-700 line-clamp-1">{resultData.username}</p>
              </div>
            </li>
            <li className="flex items-center gap-x-2">
              <AiOutlineCheckCircle className="text-2xl text-green-600" />
              <div className=" flex items-center w-full gap-x-3">
                <p className="text-gray-600">Correct:</p>
                <p className="text-gray-700">{resultData.correctAnswers}</p>
              </div>
            </li>
            <li className="flex items-center gap-x-2">
              <AiOutlineCloseCircle className="text-2xl text-red-600" />
              <div className=" flex items-center w-full gap-x-3">
                <p className="text-gray-600">Wrong:</p>
                <p className="text-gray-700">{resultData.wrongAnswers}</p>
              </div>
            </li>
            <li className="flex items-center gap-x-2">
              <MdSportsScore className="text-2xl text-purple-600" />
              <div className=" flex items-center w-full gap-x-3">
                <p className="text-gray-600">Score:</p>
                <p className="text-gray-700 line-clamp-1">{resultData.score}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <Link
        href={'/'}
        replace={true}
        className="px-3 py-2 text-xs rounded bg-purple-600 text-white mt-10 flex items-center gap-x-1"
      >
        Leaderboard
        <FiArrowUpRight className="text-sm" />
      </Link>
    </Layout>
  );
}
