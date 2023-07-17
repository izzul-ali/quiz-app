// this file usually separated to another folder etc: /context/
// because this app only use one context, so i put this file in here

'use client';

import { Dispatch, ReactNode, SetStateAction, createContext, useContext, useEffect, useState } from 'react';
import { QuizResultData } from '~/types/quiz';

interface IQuizResultContext {
  resultData: QuizResultData;
  setResultData: Dispatch<SetStateAction<QuizResultData>>;

  openResultCard: boolean;
  setOpenResultCard: Dispatch<SetStateAction<boolean>>;

  error: string;
  setError: Dispatch<SetStateAction<string>>;
}

const initialResultData: QuizResultData = {
  username: '',
  correctAnswers: 0,
  wrongAnswers: 0,
  score: 0,
};

const QuizResultContext = createContext<IQuizResultContext | null>(null);

export default function QuizResultContextProvider({ children }: { children: ReactNode }) {
  const [resultData, setResultData] = useState<QuizResultData>(initialResultData);
  const [openResultCard, setOpenResultCard] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const clearError = setTimeout(() => {
      setError('');
    }, 4000);

    return () => clearTimeout(clearError);
  }, [error]);

  return (
    <QuizResultContext.Provider
      value={{
        openResultCard,
        resultData,
        error,
        setOpenResultCard,
        setResultData,
        setError,
      }}
    >
      {children}
    </QuizResultContext.Provider>
  );
}

export function useResultQuiz() {
  const quizResultContext = useContext(QuizResultContext);

  if (!quizResultContext) {
    throw new Error('Quiz result context is not define');
  }

  return quizResultContext;
}
