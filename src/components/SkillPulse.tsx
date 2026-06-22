import type { Skill } from '../types';

interface SkillPulseProps {
  skills: Skill[];
}

export default function SkillPulse({ skills }: SkillPulseProps) {
  return (
    <div className="bg-[#fbf9f1] p-6 border border-[rgba(127,118,96,0.15)] rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h4
          className="text-[24px] font-bold text-[#0a192f] flex items-center gap-2 leading-tight tracking-[-0.01em]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Skill Pulse
          <div className="live-dot w-2.5 h-2.5 inline-block" />
        </h4>
        <span className="bg-[#facc15] px-2 py-1 text-[10px] font-black uppercase tracking-tighter badge-tilt inline-block">
          Live Signal
        </span>
      </div>

      {/* Bars */}
      <div className="h-64 flex items-end justify-between gap-2 px-4 pb-4 border-b border-[rgba(127,118,96,0.15)]">
        {skills.map((skill, i) => (
          <div key={skill.label} className="flex flex-col items-center flex-1 group h-full justify-end">
            <div className="w-full bg-[#e4e3db] rounded-t-lg h-full relative overflow-hidden">
              <div
                className="skill-bar absolute bottom-0 left-0 w-full bg-[#facc15] group-hover:opacity-90 transition-opacity"
                style={{ '--target-h': `${skill.value}%`, animationDelay: `${(i + 1) * 0.1}s` } as React.CSSProperties}
              />
            </div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.08em] mt-2 text-[#4d4632]">
              {skill.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
