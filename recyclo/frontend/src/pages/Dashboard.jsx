import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import BadgeCard from '../components/BadgeCard';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const TYPE_COLORS = {
  plastic: '#3B82F6',
  paper: '#F59E0B',
  glass: '#10B981',
  ewaste: '#8B5CF6',
  organic: '#84CC16',
  metal: '#6B7280',
};

export default function Dashboard() {
  const { user } = useAuth();
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/activity/history'),
      axios.get('/api/activity/stats'),
    ]).then(([h, s]) => {
      setHistory(h.data);
      setStats(s.data);
    }).finally(() => setLoading(false));
  }, []);

  const chartData = stats
    ? Object.entries(stats.byType).map(([type, qty]) => ({ type, qty }))
    : [];

  const availablePoints = user ? user.points - (user.redeemedPoints || 0) : 0;

  const streakDays = user?.streak || 0;
  const weekFilled = Math.min(streakDays, 7);

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-800">Welcome back, {user?.name} 👋</h1>
          <p className="text-sm text-gray-500 mt-0.5">Keep recycling and earning rewards</p>
        </div>
        <Link
          to="/log"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Log Activity
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total points', value: user?.points?.toLocaleString() || 0 },
          { label: 'Available points', value: availablePoints.toLocaleString() },
          { label: 'Current streak', value: `${user?.streak || 0} days` },
          { label: 'Items recycled', value: stats?.totalItems || 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-2xl font-semibold text-gray-800">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Streak */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Weekly streak</p>
        <div className="flex gap-2">
          {DAYS.map((d, i) => (
            <div
              key={d}
              className={`flex-1 h-8 rounded-md flex items-center justify-center text-xs font-medium ${
                i < weekFilled
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              {d[0]}
            </div>
          ))}
        </div>
        {streakDays >= 7 && (
          <p className="text-xs text-green-600 font-medium mt-2">
            🔥 7-day streak active — 10% bonus points on all activities!
          </p>
        )}
      </div>

      {/* Badges */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-medium text-gray-700">Badges</p>
          <p className="text-xs text-gray-400">{user?.points} / 2000 pts to Platinum</p>
        </div>
        <BadgeCard userBadges={user?.badges || []} points={user?.points || 0} />
        <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-2 bg-green-500 rounded-full transition-all"
            style={{ width: `${Math.min(((user?.points || 0) / 2000) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Chart */}
      {chartData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-sm font-medium text-gray-700 mb-4">Items recycled by type</p>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} barSize={32}>
              <XAxis dataKey="type" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="qty" fill="#16a34a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Activity history */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <p className="text-sm font-medium text-gray-700 mb-3">Recent activity</p>
        {history.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-4">
            No activity yet.{' '}
            <Link to="/log" className="text-green-600 underline">
              Log your first one!
            </Link>
          </p>
        ) : (
          <div className="divide-y divide-gray-50">
            {history.map((a) => (
              <div key={a._id} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm text-gray-800 capitalize">
                    {a.type}
                    <span className="text-gray-400 font-normal"> × {a.quantity}</span>
                    {a.streakBonus && (
                      <span className="ml-2 text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">
                        streak bonus
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-gray-400">
                    {new Date(a.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                    })}
                  </p>
                </div>
                <span className="text-sm font-semibold text-green-600">+{a.pointsEarned} pts</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
