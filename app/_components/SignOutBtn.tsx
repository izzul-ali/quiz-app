'use client';

import { useTransition } from 'react';
import { ImSpinner9 } from 'react-icons/im';
import signout from '~/service/signout';

export default function SignoutBtn() {
  const [pending, startTransition] = useTransition();

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(async () => await signout())}
      className="px-2 py-1 min-w-[4rem] block text-xs bg-purple-600 text-white rounded"
    >
      {pending ? <ImSpinner9 className="animate-spin mx-auto text-base fill-purple-200" /> : 'Logout'}
    </button>
  );
}
