const BADGE_META = {
  Bronze:   { emoji: '🥉', threshold: 100,  color: 'bg-orange-50 border-orange-200 text-orange-700' },
  Silver:   { emoji: '🥈', threshold: 500,  color: 'bg-gray-50 border-gray-300 text-gray-600' },
  Gold:     { emoji: '🥇', threshold: 1000, color: 'bg-yellow-50 border-yellow-300 text-yellow-700' },
  Platinum: { emoji: '💎', threshold: 2000, color: 'bg-blue-50 border-blue-200 text-blue-700' },
};

export default function BadgeCard({ userBadges = [], points = 0 }) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {Object.entries(BADGE_META).map(([name, meta]) => {
        const earned = userBadges.includes(name);
        return (
          <div
            key={name}
            className={`border rounded-xl p-3 text-center transition-all ${
              earned ? meta.color : 'bg-gray-50 border-gray-100 opacity-40'
            }`}
          >
            <div className="text-2xl mb-1">{meta.emoji}</div>
            <div className="text-xs font-medium">{name}</div>
            <div className="text-xs mt-1 opacity-70">{meta.threshold} pts</div>
          </div>
        );
      })}
    </div>
  );
}
