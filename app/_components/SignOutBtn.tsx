'use client';

import signout from '~/service/signout';

export default function SignoutBtn() {
  return (
    <button onClick={() => signout()} className="px-3 py-1 text-xs bg-purple-600 text-white rounded">
      Logout
    </button>
  );
}
