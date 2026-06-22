export default function ActiveStream() {
  return (
    <div className="bg-[#0d1c32] p-6 rounded-xl flex items-center justify-between text-white overflow-hidden relative group">
      <div className="z-10">
        <p className="text-[12px] font-semibold uppercase tracking-[0.2em] text-[#c3d1ee] mb-1">
          Active Stream
        </p>
        <h3
          className="text-[32px] font-bold text-white mb-4 leading-tight tracking-[-0.02em]"
          style={{ fontFamily: 'Sora, sans-serif' }}
        >
          Entrepreneurship and Innovation
        </h3>
        <button className="px-6 py-4 bg-[#facc15] text-[#6c5700] font-bold rounded-full hover:scale-105 transition-transform flex items-center gap-2">
          Resume Lab Session
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>

      {/* Background Decoration */}
      <div className="absolute right-0 top-0 h-full opacity-10 pointer-events-none group-hover:scale-110 transition-transform duration-700">
        <span className="material-symbols-outlined text-[180px]">science</span>
      </div>
    </div>
  );
}
