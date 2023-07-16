import { GiThink } from 'react-icons/gi';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="w-full h-screen flex flex-col items-center">
      <div className="flex items-center text-7xl font-bold mt-36 text-gray-700">
        <span className="rotate-6">4</span>
        <span>
          <GiThink className="fill-purple-600" />
        </span>
        <span className="-translate-x-3 -rotate-6">4</span>
      </div>

      <div className="mt-7 space-y-1 font-semibold text-center">
        <p className="text-lg md:text-xl text-gray-700">Something gone wrong!</p>
        <p className="text-sm md:text-lg text-gray-600">The page you were looking for doesn't exist</p>
      </div>

      <Link href={'/'} replace className="mt-7 text-xs px-7 py-2 rounded bg-purple-600 text-white">
        Go Back
      </Link>
    </div>
  );
}
