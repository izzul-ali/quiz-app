import { MdOutlineErrorOutline } from 'react-icons/md';
import Link from 'next/link';
import QuestionCard from '~/app/_components/quiz/QuestionCard';
import fetchQuestions from '~/service/question';
import Quiz from '~/app/_components/quiz/Quiz';
import ResultCard from '~/app/_components/quiz/ResultCard';
import QuizResultContextProvider from '../_components/quiz/ResultContext';

export default async function QuizPage() {
  const resp = await fetchQuestions();

  return (
    <main className="px-2 py-5 overflow-hidden w-full h-screen min-h-screen bg-purple-100">
      <div className="w-full h-full flex flex-col items-center justify-center">
        <div className="relative w-[95%] lg:w-[60%] h-fit">
          {resp.error && resp.isFinished ? (
            <div className="text-sm md:text-base text-center text-gray-800 rounded-xl bg-purple-50/50 shadow-md py-6 px-4 w-[95%] h-fit flex flex-col items-center justify-center mx-auto z-10">
              <MdOutlineErrorOutline className="text-2xl fill-red-600 mb-2" />
              <p>{resp.error}</p>
              <Link
                href={'/'}
                replace
                className="text-xs px-4 py-1 mt-4 rounded bg-purple-200 cursor-pointer hover:bg-purple-300"
              >
                Back to Home
              </Link>
            </div>
          ) : (
            <QuizResultContextProvider>
              <Quiz
                questionCard={
                  <QuestionCard expired={resp.expired} isFinished={resp.isFinished} questionsAnswers={resp.questions} />
                }
                resultCard={<ResultCard />}
              />
            </QuizResultContextProvider>
          )}

          <div className="p-8 rounded-full bg-purple-300/20 absolute -top-8 right-4"></div>
          <div className="p-8 rounded-full bg-purple-200/50 absolute -top-8 -left-2"></div>
          <div className="p-10 rounded-full bg-purple-300/30 absolute bottom-10 -left-4"></div>
          <div className="p-14 rounded-full bg-purple-200/40 absolute -bottom-10 -right-5"></div>
        </div>
      </div>
    </main>
  );
}
