import { useState } from 'react';
import type { NavItem } from '../types';

interface SidebarProps {
  navItems: NavItem[];
}

export default function Sidebar({ navItems }: SidebarProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <aside className="bg-[#f0eee6] h-screen w-64 border-r border-[rgba(127,118,96,0.15)] flex flex-col py-6 px-4 gap-2 z-50 flex-shrink-0">
      {/* Logo */}
      <div className="mb-10 px-2">
        <h1 className="font-black text-[#0a192f] tracking-tighter text-3xl" style={{ fontFamily: 'Sora, sans-serif' }}>
          EPIC AI
        </h1>
        <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#4d4632] mt-1">
          V.2.4 Active
        </p>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-2">
        {navItems.map((item, i) => (
          <a
            key={item.label}
            href={item.href || '#'}
            target={item.external ? '_blank' : undefined}
            rel={item.external ? 'noopener noreferrer' : undefined}
            onClick={(e) => {
              if (!item.external) {
                e.preventDefault();
                setActiveIndex(i);
              }
            }}
            className={`flex items-center gap-4 px-4 py-2 rounded-lg font-bold transition-all active:scale-95 ${
              i === activeIndex
                ? 'bg-[#facc15] text-[#6c5700]'
                : 'text-[#4d4632] hover:text-[#0a192f] hover:bg-[#e4e3db] transition-colors duration-200'
            }`}
          >
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </a>
        ))}
      </nav>

      {/* New Build */}
      <button className="w-full py-4 bg-[#facc15] text-[#6c5700] font-bold rounded-full shadow-sm hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 mb-6">
        <span className="material-symbols-outlined">add</span>
        New Build
      </button>

      {/* Bottom Links */}
      <div className="border-t border-[rgba(127,118,96,0.15)] pt-4 space-y-2">
        {[{ icon: 'settings', label: 'Settings' }, { icon: 'help_outline', label: 'Support' }].map((link) => (
          <a
            key={link.label}
            href="#"
            className="flex items-center gap-4 px-4 py-2 text-[#4d4632] hover:text-[#0a192f] transition-colors"
          >
            <span className="material-symbols-outlined">{link.icon}</span>
            <span>{link.label}</span>
          </a>
        ))}
      </div>

      {/* User */}
      <div className="mt-4 px-2 flex items-center gap-2">
        <img
          className="w-10 h-10 rounded-full border border-[#d1c6ab]"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuA3aTBffXwguK2KmcvekZz2foelVouTaMakHIad_kGJm46M-zoYzfJWHT99PIqGlOiz06B0fDFsAQ8fH2kAcRVjPSzDGGdPhsRm8ETEn1NhlJ3Og4OE9V7vAD9D8a6LahWYLJ5fAH0EIIr6COiVoAwtrGB3Hl33RSih5LJs_x0YneB-9RzDivJasl53BwBIcaauGKaOfSDbx0KnXs8ikv-cX_uBO_Bx4hBBhh_rjLm8uby_EdVPNLFIvHEN4vxz21Ih5HSoitCLrOU"
          alt="Maya Professional"
        />
        <div className="overflow-hidden">
          <p className="font-bold text-sm truncate text-[#0a192f]">Maya Professional</p>
        </div>
      </div>
    </aside>
  );
}
