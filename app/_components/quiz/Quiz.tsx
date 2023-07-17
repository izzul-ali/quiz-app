'use client';

import { useResultQuiz } from './ResultContext';

interface IQuiz {
  questionCard: React.ReactNode;
  resultCard: React.ReactNode;
}

export default function Quiz({ questionCard, resultCard }: IQuiz) {
  const { openResultCard } = useResultQuiz();

  return <>{openResultCard ? resultCard : questionCard}</>;
}
