import { useState, useRef } from 'react';

export default function TopBar() {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex justify-between items-center w-full px-6 sticky top-0 z-40 backdrop-blur-md h-16 border-b border-[rgba(127,118,96,0.15)]"
      style={{ backgroundColor: 'rgba(251,249,241,0.8)' }}>
      {/* Stats */}
      <div className="flex items-center gap-6">
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#735c00] border-b-2 border-[#735c00] pb-1 cursor-pointer">
          Build Momentum: +12%
        </span>
        <span className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#4d4632] hover:text-[#735c00] transition-colors cursor-pointer">
          Collaborative Velocity: 94
        </span>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search resources..."
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className={`bg-[#f0eee6] border-none rounded-full px-4 py-2 text-sm focus:ring-1 focus:ring-[#735c00] outline-none transition-all duration-300 ${focused ? 'w-80' : 'w-64'}`}
          />
          <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-[#4d4632]">
            search
          </span>
        </div>
        <button className="material-symbols-outlined p-2 text-[#4d4632] hover:text-[#735c00] transition-colors">
          notifications
        </button>
        <button className="px-4 py-1 bg-[#facc15] text-[#6c5700] font-bold rounded-lg text-sm hover:opacity-90 active:scale-95 transition-all">
          Resume Building
        </button>
      </div>
    </header>
  );
}
