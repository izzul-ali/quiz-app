'use client';

import { useState } from 'react';

export default function Faq() {
  const [faq, setFaq] = useState<number>(-1);

  return (
    <div className="mt-16 w-full md:w-3/5 mx-auto">
      <h2 className="text-lg font-semibold mb-3 pl-3 text-gray-700">FAQs</h2>
      <ul id="faqs" className="space-y-3">
        {faqs.map((f, i) => (
          <li
            key={i}
            onClick={() => setFaq((prev) => (prev === i ? -1 : i))}
            className="bg-transparent shadow-sm py-3 px-5 h-fit rounded border border-gray-200 text-sm cursor-pointer"
          >
            <div className="flex items-center justify-between gap-x-4 text-gray-600">
              <p className="font-semibold">{f.question}</p>
              <span className={`text-base transition-all duration-300 ${faq === i && 'rotate-90'}`}>{'>'}</span>
            </div>

            <p
              className={`mt-3 text-gray-600 leading-normal transition-all duration-500 ${
                faq === i ? 'opacity-100 translate-y-0' : 'opacity-0 sr-only -translate-y-5'
              }`}
            >
              {f.answer}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

type Faq = {
  question: string;
  answer: string;
};

const faqs: Faq[] = [
  {
    question: 'How to play?',
    answer:
      'First you have to sign in using your email, then the email you entered will receive an OTP code. Please verify the code you received, then you can play.',
  },
  {
    question: 'How many questions are there to solve?',
    answer: 'There are 10 questions to be solved, and each correct question will get 100 points.',
  },
  {
    question: 'How long is the time limit for completing the quiz?',
    answer:
      'You must complete the quiz in less than 10 minutes. If you exceed the time limit, the quiz will automatically be submitted.',
  },
];
