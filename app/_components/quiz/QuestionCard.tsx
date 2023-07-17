'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { memo, useEffect, useState } from 'react';
import { MdOutlineErrorOutline, MdOutlineTimer } from 'react-icons/md';
import { QuestionList, QuizHistory, QuizResultData } from '~/types/quiz';
import { ResponseApi } from '~/helper/response-api';
import { useResultQuiz } from './ResultContext';
import Layout from './Layout';

interface IQuizCard {
  expired: number;
  isFinished: boolean;
  questionsAnswers: QuestionList[];
}

export default function QuizCard({ expired, isFinished, questionsAnswers }: IQuizCard) {
  const router = useRouter();

  const { setOpenResultCard, setResultData, error, setError } = useResultQuiz();

  const [selectedQuestionNumber, setSelectedQuestionNumber] = useState<number>(0);
  const [questionList, setQuestionList] = useState<QuestionList[]>(isFinished ? questionsAnswers : []);
  const [answers, setAnswers] = useState<QuizHistory[]>([]);

  useEffect(() => {
    if (isFinished) {
      localStorage.setItem('questions', JSON.stringify(questionsAnswers));
      localStorage.removeItem('quiz_history');
      return;
    }

    const questionsHistory: QuestionList[] = JSON.parse(localStorage.getItem('questions') || '[]');
    const anwersHistory: QuizHistory[] = JSON.parse(localStorage.getItem('quiz_history') || '[]');

    // when question history is not exists on localstorage then delete correct question in db
    if (questionsHistory?.length < 1) {
      deleteCorrectQuestion();
      router.replace('/');
      return;
    }

    setQuestionList((prev) => (isFinished ? prev : questionsHistory));
    setAnswers(anwersHistory);
  }, []);

  function handleAnswer(questionNumber: number, answer: string) {
    saveAnswer(questionNumber + 1, answer);

    const ansIndex = answers.findIndex((ans) => ans.questionNumber === questionNumber);

    if (ansIndex === -1) {
      setAnswers((prev) => (prev.length !== 0 ? [...prev, { questionNumber, answer }] : [{ questionNumber, answer }]));
      return;
    }

    // prevent rerender component
    if (answers[ansIndex]?.answer === answer) return;

    setAnswers((prev) => prev.map((p) => (p.questionNumber === questionNumber ? { ...p, answer } : p)));
  }

  const questionAnswer = questionList[selectedQuestionNumber];

  return (
    <Layout>
      <AnimatePresence>
        {error !== '' && (
          <motion.div
            initial={{ y: -15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.6 }}
            className="absolute -top-16 w-[90%] overflow-hidden py-2 pl-8 pr-2 text-center bg-red-700/10 rounded-md"
          >
            <span className="px-2 left-0 top-0 bottom-0 w-fit bg-red-700 absolute flex items-center">
              <MdOutlineErrorOutline className="fill-white" />
            </span>

            <p className="line-clamp-2">{error}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <CoutdownTimer expired={expired} />

      <div className="mx-auto w-full mt-10 relative z-20 bg-transparent">
        <span className="absolute -top-4 m-auto left-0 right-0 w-fit text-xs px-7 py-2 text-white bg-purple-600 rounded-2xl">
          Question {selectedQuestionNumber + 1} of 10
        </span>

        {/* question box */}
        <div className="w-full bg-white rounded px-2 pb-5 pt-10 text-center">
          <p className="break-words">{questionAnswer?.question}</p>
        </div>

        {/* choisee answer */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
          {questionAnswer?.answer.map((a, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(selectedQuestionNumber, a)}
              className={`hover:bg-purple-200 py-3 break-words rounded border border-gray-100 hover:border-purple-400 ${
                answers.some((v) => v.answer === a) ? 'bg-purple-200 border-purple-400' : 'bg-white'
              }`}
            >
              {a}
            </button>
          ))}
        </div>

        <div className="text-xs mt-7 flex gap-x-3 justify-center items-center text-white">
          <button
            disabled={selectedQuestionNumber === 0}
            onClick={() => setSelectedQuestionNumber((prev) => prev - 1)}
            className="px-6 py-2 rounded-2xl bg-purple-600 hover:shadow-md"
          >
            Prev
          </button>
          {selectedQuestionNumber < 9 && (
            <button
              disabled={selectedQuestionNumber === 9}
              onClick={() => setSelectedQuestionNumber((prev) => prev + 1)}
              className="px-6 py-2 rounded-2xl bg-purple-600 hover:shadow-md"
            >
              Next
            </button>
          )}

          {selectedQuestionNumber === 9 && (
            <button
              // disabled={selectedQuestionNumber === 9}
              onClick={async () => {
                const resp = await handleSubmit(false);
                if (typeof resp === 'string') {
                  setError(resp);
                  return;
                }

                setResultData(resp);
                setOpenResultCard(true);
              }}
              className="px-6 py-2 rounded-2xl bg-purple-600 hover:shadow-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </Layout>
  );
}

const CoutdownTimer = memo(({ expired }: { expired: number }) => {
  const { setResultData, setOpenResultCard, setError } = useResultQuiz();

  // const [duration, setDuration] = useState<number>(expired - new Date().getTime());
  // if we set duration like line above, the error react hydration will come
  const [duration, setDuration] = useState<number>(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setDuration(expired - new Date().getTime());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // TODO: still not running

  if (duration < 1) {
    handleSubmit(true)
      .then((resp) => {
        if (typeof resp === 'string') {
          setError(resp);
          return;
        }

        setResultData(resp);
        setOpenResultCard(true);
        return;
      })
      .catch((err) => setError(err));
  }

  const expDuration =
    duration > 0 ? `${new Date(duration).getMinutes()} : ${new Date(duration).getSeconds()}` : '0 : 0';

  return (
    <span className="min-w-[100px] flex items-center gap-x-2 bg-purple-200 font-semibold px-5 py-1 rounded-full">
      <MdOutlineTimer />
      <p className="text-gray-600">{expDuration}</p>
    </span>
  );
});

// delete correct question on db when users remove question history from localstorage
async function deleteCorrectQuestion() {
  await fetch(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/quiz/question`, {
    cache: 'no-store',
    method: 'DELETE',
    credentials: 'include',
  });
}

// save answers to localstorage
function saveAnswer(questionNumber: number, answer: string) {
  const quizHistoryKey = 'quiz_history';
  const quisHistory = localStorage.getItem(quizHistoryKey);

  if (!quisHistory) {
    localStorage.setItem(
      quizHistoryKey,
      JSON.stringify([
        {
          questionNumber,
          answer,
        },
      ] as QuizHistory[])
    );

    return;
  }

  const quiz: QuizHistory[] = JSON.parse(quisHistory!) || [];

  const qIndex = quiz?.findIndex((q) => q.questionNumber === questionNumber);

  if (qIndex !== -1) {
    quiz[qIndex].answer = answer;

    localStorage.setItem(quizHistoryKey, JSON.stringify(quiz));
    return;
  }

  quiz.push({ questionNumber, answer });

  localStorage.setItem(quizHistoryKey, JSON.stringify(quiz));
}

// submit quiz and calculate score
async function handleSubmit(isTimeOut: boolean) {
  const quizAnswers = typeof Window !== 'undefined' && localStorage.getItem('quiz_history');

  if (!quizAnswers && !isTimeOut) return 'You must finished quiz before submit';

  // fetch api to calculate score
  const resp = await fetch(`${process.env.NEXT_PUBLIC_APP_DOMAIN}/api/quiz`, {
    cache: 'no-store',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'POST',
    body: JSON.stringify({
      isTimeout: isTimeOut,
      answers: quizAnswers,
    }),
  });

  const data = (await resp.json()) as ResponseApi<QuizResultData | null>;

  if (resp.ok && data.data) {
    localStorage.removeItem('questions');
    localStorage.removeItem('quiz_history');

    return data.data;
  }

  return data.error;
}
