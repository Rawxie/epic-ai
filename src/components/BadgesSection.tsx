import type { Badge } from '../types';

interface BadgesSectionProps {
  badges: Badge[];
}

export default function BadgesSection({ badges }: BadgesSectionProps) {
  return (
    <div>
      <h4 className="text-[24px] font-bold text-[#0a192f] mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
        Badges Earned
      </h4>
      <div className="flex flex-wrap gap-4">
        {badges.map((badge) => (
          <div
            key={badge.label}
            className={`${badge.bgClass} ${badge.textClass} px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.08em] ${badge.tilt === 'tilt' ? 'badge-tilt' : 'badge-tilt-alt'} flex items-center gap-2`}
          >
            <span className={`material-symbols-outlined ${badge.iconColor}`}>{badge.icon}</span>
            {badge.label}
          </div>
        ))}
      </div>
    </div>
  );
}
