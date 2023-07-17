export type Quiz = {
  category: string;
  correct_answer: string;
  difficulty: string;
  incorrect_answers: string[];
  question: string;
  type: string;
};

export type QuizResultData = {
  username: string;
  score: number;
  correctAnswers: number;
  wrongAnswers: number;
};

export type QuestionList = {
  number: number;
  question: string;
  answer: string[];
};

export type QuizHistory = {
  questionNumber: number;
  answer: string;
};
