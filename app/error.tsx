'use client';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <h1 className="mt-36 text-7xl tracking-wide font-bold text-gray-800">500</h1>
      <h2 className="text-lg mt-3 font-semibold text-gray-700">Something gone wrong!</h2>
      <h3 className="text-sm mt-1 font-semibold text-gray-600">Please notify the author if something goes wrong</h3>
      <button onClick={() => reset()} className="mt-5 text-xs px-7 py-2 rounded bg-purple-600 text-white">
        Go Back
      </button>
    </div>
  );
}
