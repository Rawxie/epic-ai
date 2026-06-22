export default function WelcomeSection() {
  return (
    <section>
      <h2 className="text-[#0a192f] text-[48px] font-extrabold leading-tight tracking-[-0.04em]"
          style={{ fontFamily: 'Sora, sans-serif' }}>
        Welcome back,{' '}
        <span className="relative inline-block">
          Maya
          <span className="absolute -bottom-1 left-0 w-full h-3 bg-[#facc15] -z-10 opacity-60 pointer-events-none" />
        </span>
      </h2>
      <p className="mt-2 text-[#4d4632] text-[18px] leading-relaxed">
        Your path to proof is accelerating. Ready to build today?
      </p>
    </section>
  );
}
