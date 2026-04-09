import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const medals = ['🥇', '🥈', '🥉'];

export default function Leaderboard() {
  const { user } = useAuth();
  const [board, setBoard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('/api/leaderboard').then((r) => setBoard(r.data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Leaderboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Top recyclers this month</p>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        {board.map((entry, i) => {
          const isYou = entry.name === user?.name;
          return (
            <div
              key={entry._id}
              className={`flex items-center gap-4 px-5 py-4 border-b border-gray-50 last:border-b-0 ${
                isYou ? 'bg-green-50' : ''
              }`}
            >
              <div className="w-8 text-center text-lg">
                {i < 3 ? medals[i] : <span className="text-sm text-gray-400 font-medium">{i + 1}</span>}
              </div>
              <div className="flex-1">
                <p className={`text-sm font-medium ${isYou ? 'text-green-700' : 'text-gray-800'}`}>
                  {entry.name} {isYou && <span className="text-xs font-normal">(you)</span>}
                </p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  {(entry.badges || []).map((b) => (
                    <span key={b} className="text-xs bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">
                      {b}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-green-600">{entry.points.toLocaleString()} pts</p>
                {entry.streak > 0 && (
                  <p className="text-xs text-orange-400 mt-0.5">🔥 {entry.streak}d streak</p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
