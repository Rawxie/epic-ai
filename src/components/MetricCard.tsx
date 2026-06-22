import type { Metric } from '../types';

interface MetricCardProps {
  metric: Metric;
}

export default function MetricCard({ metric }: MetricCardProps) {
  return (
    <div className="bg-[#f6f4ec] p-6 border border-[rgba(127,118,96,0.15)] rounded-xl shadow-sm hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#4d4632]">
          {metric.label}
        </p>
        {metric.badge && (
          <span className="text-[#735c00] font-bold text-sm">{metric.badge}</span>
        )}
      </div>

      <h3 className="text-[48px] font-extrabold text-[#0a192f] leading-tight tracking-[-0.04em] mt-2"
          style={{ fontFamily: 'Sora, sans-serif' }}>
        {metric.value}
      </h3>

      {metric.progress !== undefined && (
        <div className="w-full bg-[#e4e3db] h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="bg-[#735c00] h-full rounded-full"
            style={{ width: `${metric.progress}%` }}
          />
        </div>
      )}

      {metric.subLabel && (
        <p className="text-xs text-[#4d4632] mt-1">{metric.subLabel}</p>
      )}

      {metric.cta && (
        <a
          href={metric.cta.href}
          className="text-xs bg-[#facc15] text-[#6c5700] font-bold px-2 py-1 rounded hover:opacity-90 mt-2 inline-block transition-all"
        >
          {metric.cta.label}
        </a>
      )}
    </div>
  );
}
