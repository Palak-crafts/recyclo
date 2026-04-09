import { useEffect, useState } from 'react';
import axios from 'axios';

const CATEGORY_COLORS = {
  discount: 'bg-blue-50 text-blue-600 border-blue-100',
  impact:   'bg-green-50 text-green-600 border-green-100',
  product:  'bg-purple-50 text-purple-600 border-purple-100',
  voucher:  'bg-amber-50 text-amber-600 border-amber-100',
};

export default function Rewards() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState(null);
  const [message, setMessage] = useState('');

  const fetchRewards = () =>
    axios.get('/api/rewards').then((r) => setData(r.data)).finally(() => setLoading(false));

  useEffect(() => { fetchRewards(); }, []);

  const redeem = async (id) => {
    setRedeeming(id);
    setMessage('');
    try {
      const { data: res } = await axios.post('/api/rewards/redeem', { rewardId: id });
      setMessage(res.message);
      fetchRewards();
    } catch (err) {
      setMessage(err.response?.data?.error || 'Redemption failed');
    } finally {
      setRedeeming(null);
    }
  };

  if (loading) return <div className="text-center py-10 text-gray-400">Loading...</div>;

  const available = data.userPoints - data.redeemedPoints;

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Rewards</h1>
        <p className="text-sm text-gray-500 mt-0.5">Redeem your points for real rewards</p>
      </div>

      {/* Points summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white border border-gray-100 rounded-xl p-4">
          <p className="text-xs text-gray-400 mb-1">Total earned</p>
          <p className="text-2xl font-semibold text-gray-800">{data.userPoints.toLocaleString()} pts</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs text-green-600 mb-1">Available to spend</p>
          <p className="text-2xl font-semibold text-green-700">{available.toLocaleString()} pts</p>
        </div>
      </div>

      {message && (
        <div className={`text-sm rounded-lg px-4 py-2 border ${
          message.includes('Successfully')
            ? 'bg-green-50 border-green-200 text-green-700'
            : 'bg-red-50 border-red-200 text-red-600'
        }`}>
          {message}
        </div>
      )}

      {/* Rewards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {data.rewards.map((r) => {
          const canAfford = available >= r.cost;
          return (
            <div
              key={r.id}
              className={`bg-white border rounded-xl p-4 flex flex-col gap-3 ${
                canAfford ? 'border-gray-100' : 'border-gray-100 opacity-60'
              }`}
            >
              <div>
                <span className={`text-xs px-2 py-0.5 rounded border font-medium ${CATEGORY_COLORS[r.category]}`}>
                  {r.category}
                </span>
                <p className="text-sm font-medium text-gray-800 mt-2">{r.name}</p>
              </div>
              <div className="flex items-center justify-between mt-auto">
                <p className="text-lg font-bold text-green-600">{r.cost} pts</p>
                <button
                  onClick={() => redeem(r.id)}
                  disabled={!canAfford || redeeming === r.id}
                  className={`text-sm px-4 py-1.5 rounded-lg font-medium transition-colors ${
                    canAfford
                      ? 'bg-green-600 hover:bg-green-700 text-white'
                      : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {redeeming === r.id ? 'Redeeming...' : canAfford ? 'Redeem' : 'Need more pts'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
