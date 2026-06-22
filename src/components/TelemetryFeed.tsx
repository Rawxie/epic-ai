import type { TelemetryEntry } from '../types';

interface TelemetryFeedProps {
  entries: TelemetryEntry[];
}

export default function TelemetryFeed({ entries }: TelemetryFeedProps) {
  return (
    <section
      className="p-6 rounded-xl overflow-hidden border border-[#0a192f] shadow-2xl"
      style={{ backgroundColor: '#0a192f', fontFamily: 'JetBrains Mono, monospace', color: '#c3d1ee' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6 border-b border-[rgba(81,95,120,0.2)] pb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 bg-[#735c00] rounded-full animate-pulse" />
          <h4 className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#facc15]">
            Recent Telemetry Signal
          </h4>
        </div>
        <span className="text-[10px] text-[#515f78] uppercase">Real-time Feed</span>
      </div>

      {/* Entries */}
      <div className="space-y-4">
        {entries.map((entry, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-[#735c00] shrink-0">[{entry.timestamp}]</span>
            {entry.type === 'log' ? (
              <p>
                {entry.content}{' '}
                <span className="text-[#facc15]">{entry.highlight}</span>
              </p>
            ) : (
              <div className="bg-[rgba(81,95,120,0.1)] p-4 rounded-lg border-l-2 border-[#facc15]">
                <p className="text-[#fbf9f1] font-bold mb-1">Coach Session Note:</p>
                <p className="text-sm italic">
                  {entry.content} - {entry.noteAuthor}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-[rgba(81,95,120,0.2)] flex justify-center">
        <button className="text-sm text-[#735c00] hover:underline flex items-center gap-1">
          View Full Activity Log
          <span className="material-symbols-outlined text-xs">unfold_more</span>
        </button>
      </div>
    </section>
  );
}
