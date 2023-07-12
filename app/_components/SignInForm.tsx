'use client';

import { useRef, useState } from 'react';
import { experimental_useFormStatus as useFormStatus } from 'react-dom';
import { ImSpinner9 } from 'react-icons/im';
import { codeVerification, signinEmail } from '~/server/signin';

export default function Signin() {
  const { pending } = useFormStatus();

  const [error, setError] = useState<string>('');
  const [showInputCode, setshowInputCode] = useState<boolean>(false);

  const emailRef = useRef<HTMLInputElement | null>(null);
  const codeRef = useRef<HTMLInputElement | null>(null);

  return (
    <form
      action={async (data) => {
        const res = await (showInputCode ? codeVerification(data) : signinEmail(data));
        if (res?.error) {
          setError(res.error);
          return;
        }

        setshowInputCode(true);
      }}
      className="w-[80%] sm:w-[50%] lg:w-[30%] mx-auto text-sm text-gray-800"
    >
      {!showInputCode && (
        <input
          type="email"
          name="email"
          id="email"
          required
          ref={emailRef}
          placeholder="Enter an email address"
          className={`bg-gray-100 w-full px-2 py-3 rounded border border-gray-200 focus:border-purple-600 ${
            error && 'border-red-600'
          } transition-colors duration-200`}
        />
      )}

      {showInputCode && (
        <input
          type="text"
          inputMode="numeric"
          name="code"
          maxLength={6}
          required
          autoFocus
          autoComplete="off"
          ref={codeRef}
          placeholder="OTP number"
          className={`bg-transparent w-full p-2 rounded-b-none border-b border-purple-100 focus:border-purple-600 text-center text-lg font-semibold text-gray-600 tracking-wider placeholder:text-gray-400 placeholder:text-sm placeholder:font-normal ${
            error && 'border-red-600'
          } transition-colors duration-200`}
        />
      )}

      {error && <p className="text-xs mt-1 ml-1 text-red-600 line-clamp-1 font-light">{error}</p>}

      <button type="submit" className="w-full py-3 rounded bg-purple-600 mt-2 text-white">
        {pending ? (
          <ImSpinner9 className="animate-spin mx-auto text-xl fill-purple-200" />
        ) : (
          `${showInputCode ? 'Verify OTP' : 'continue with email'}`
        )}
      </button>
    </form>
  );
}
