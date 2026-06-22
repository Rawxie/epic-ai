import type { HeatmapCell } from '../types';

interface SidePanelProps {
  heatmap: HeatmapCell[];
}

export default function SidePanel({ heatmap }: SidePanelProps) {
  return (
    <div className="col-span-12 lg:col-span-4 space-y-6" style={{ transform: 'translateY(0px)', transition: 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}>

      {/* Lab Heatmap */}
      <div className="bg-[#f0eee6] p-6 border border-[rgba(127,118,96,0.15)] rounded-xl">
        <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] mb-4 text-[#4d4632]">
          Lab Momentum
        </h4>
        <div className="grid grid-cols-7 gap-1">
          {heatmap.map((cell, i) => (
            <div
              key={i}
              className="aspect-square bg-[#facc15] rounded-sm"
              style={{ opacity: cell.opacity / 100 }}
            />
          ))}
        </div>
        <p className="text-[10px] mt-4 text-[#4d4632]">Last 30 Days of builder activity</p>
      </div>

      {/* Weekly Streak */}
      <div className="bg-[#ffdcc3] p-6 border border-[rgba(127,118,96,0.15)] rounded-xl flex items-center gap-6">
        <div className="flex-1">
          <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#6e3900]">
            Weekly Builder Streak
          </p>
          <h3 className="text-[32px] font-bold text-[#2f1500]" style={{ fontFamily: 'Sora, sans-serif' }}>
            12 Days
          </h3>
        </div>
        <span className="material-symbols-outlined text-[#2f1500] text-4xl">local_fire_department</span>
      </div>

      {/* Competitive Trigger */}
      <div
        className="bg-[#fbf9f1] p-6 border-2 border-[#facc15] rounded-xl"
        style={{ boxShadow: '0 10px 20px rgba(250,204,21,0.1)' }}
      >
        <div className="flex items-center gap-2 mb-2 text-[#735c00]">
          <span className="material-symbols-outlined">trending_up</span>
          <h4 className="font-bold text-sm">Collaborative Momentum</h4>
        </div>
        <h2 className="text-[48px] font-extrabold text-[#0a192f] mb-1 leading-tight tracking-[-0.04em]"
            style={{ fontFamily: 'Sora, sans-serif' }}>
          84th
        </h2>
        <p className="text-sm text-[#4d4632]">
          You and 142 other builders are accelerating your Proof Portfolios this week. Keep building.
        </p>
      </div>
    </div>
  );
}
