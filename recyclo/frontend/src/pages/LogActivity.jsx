import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const WASTE_TYPES = [
  { value: 'plastic', label: 'Plastic', pts: 10, desc: 'Bottles, bags, containers' },
  { value: 'paper',   label: 'Paper',   pts: 6,  desc: 'Newspapers, cardboard' },
  { value: 'glass',   label: 'Glass',   pts: 15, desc: 'Jars, bottles' },
  { value: 'ewaste',  label: 'E-Waste', pts: 20, desc: 'Phones, cables, electronics' },
  { value: 'organic', label: 'Organic', pts: 5,  desc: 'Food waste, compost' },
  { value: 'metal',   label: 'Metal',   pts: 12, desc: 'Cans, tins, scrap' },
];

export default function LogActivity() {
  const { refreshUser, user } = useAuth();
  const [type, setType] = useState('plastic');
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selected = WASTE_TYPES.find((t) => t.value === type);
  const streakBonus = (user?.streak || 0) >= 7;
  const preview = Math.round(selected.pts * quantity * (streakBonus ? 1.1 : 1));

  const handleSubmit = async () => {
    setError('');
    setLoading(true);
    try {
      const { data } = await axios.post('/api/activity/log', { type, quantity });
      setResult(data);
      await refreshUser();
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white border border-green-200 rounded-2xl p-8 text-center">
          <div className="text-5xl mb-4">♻️</div>
          <h2 className="text-xl font-semibold text-gray-800 mb-1">Activity logged!</h2>
          <p className="text-3xl font-bold text-green-600 my-3">+{result.activity.pointsEarned} pts</p>
          {result.streakBonus && (
            <p className="text-sm text-orange-500 mb-2">🔥 Streak bonus applied!</p>
          )}
          <p className="text-sm text-gray-500 mb-1">Total points: <span className="font-semibold text-gray-800">{result.totalPoints}</span></p>
          <p className="text-sm text-gray-500 mb-4">Streak: <span className="font-semibold text-gray-800">{result.streak} days</span></p>
          {result.newBadges.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
              <p className="text-sm font-semibold text-yellow-700">
                🏆 New badge{result.newBadges.length > 1 ? 's' : ''} unlocked: {result.newBadges.join(', ')}!
              </p>
            </div>
          )}
          <button
            onClick={() => { setResult(null); setQuantity(1); }}
            className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-2 text-sm font-medium transition-colors"
          >
            Log another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-5">
      <div>
        <h1 className="text-xl font-semibold text-gray-800">Log recycling activity</h1>
        <p className="text-sm text-gray-500 mt-0.5">Select what you recycled and how many items</p>
      </div>

      {/* Type selector */}
      <div className="grid grid-cols-2 gap-2">
        {WASTE_TYPES.map((t) => (
          <button
            key={t.value}
            onClick={() => setType(t.value)}
            className={`text-left p-3 rounded-xl border transition-all ${
              type === t.value
                ? 'border-green-400 bg-green-50'
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
          >
            <p className={`text-sm font-medium ${type === t.value ? 'text-green-700' : 'text-gray-700'}`}>
              {t.label}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
            <p className={`text-xs font-semibold mt-1 ${type === t.value ? 'text-green-600' : 'text-gray-500'}`}>
              {t.pts} pts/item
            </p>
          </button>
        ))}
      </div>

      {/* Quantity */}
      <div className="bg-white border border-gray-100 rounded-xl p-4">
        <label className="text-sm font-medium text-gray-700 block mb-2">
          Quantity: <span className="text-green-600">{quantity} item{quantity > 1 ? 's' : ''}</span>
        </label>
        <input
          type="range"
          min={1}
          max={50}
          step={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="w-full accent-green-600"
        />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>1</span><span>25</span><span>50</span>
        </div>
      </div>

      {/* Preview */}
      <div className="bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm text-green-700 font-medium">You will earn</p>
          {streakBonus && <p className="text-xs text-orange-500 mt-0.5">🔥 10% streak bonus included</p>}
        </div>
        <p className="text-3xl font-bold text-green-600">{preview} pts</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-2">
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg py-3 text-sm font-medium transition-colors disabled:opacity-50"
      >
        {loading ? 'Logging...' : 'Submit activity'}
      </button>
    </div>
  );
}
