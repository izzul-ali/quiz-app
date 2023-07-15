import { FaMedal } from 'react-icons/fa';

export default function Leaderboard({ leaderboard }: { leaderboard: Array<{ name: string; score: number }> }) {
  return (
    <table className="mt-10 w-full md:w-[80%] mx-auto">
      <thead className="text-left border-b text-gray-700">
        <tr className="[&>th]:py-2 [&>th]:px-3">
          <th scope="col" className="text-center">
            Rank
          </th>
          <th scope="col">Name</th>
          <th scope="col">Score</th>
        </tr>
      </thead>
      <tbody className="text-gray-800">
        {leaderboard?.map((u, i) => (
          <tr key={u.name} className="[&>td]:p-3 border-b">
            <td className="text-center">
              {i < 3 ? (
                <FaMedal
                  className={`mx-auto ${i === 0 && 'fill-amber-500'} ${i === 1 && 'fill-gray-700'} ${
                    i === 2 && 'fill-amber-900'
                  }`}
                />
              ) : (
                i + 1
              )}
            </td>
            <td className="break-all">{u.name}</td>
            <td>{u.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
