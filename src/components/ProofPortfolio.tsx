import type { PortfolioItem } from '../types';

interface ProofPortfolioProps {
  items: PortfolioItem[];
}

export default function ProofPortfolio({ items }: ProofPortfolioProps) {
  return (
    <div>
      <h4 className="text-[24px] font-bold text-[#0a192f] mb-6" style={{ fontFamily: 'Sora, sans-serif' }}>
        Proof Portfolio
      </h4>
      <ul className="space-y-2">
        {items.map((item) => (
          <li
            key={item.id}
            className="group flex items-center justify-between p-4 bg-[#f6f4ec] border-b border-[rgba(127,118,96,0.15)] hover:bg-[#eae8e0] transition-colors"
          >
            <div className="flex items-center gap-4">
              <span className="font-mono text-sm text-[#735c00] font-bold">{item.id}</span>
              <span className="font-bold text-[#0a192f]">{item.label}</span>
            </div>
            <span className="material-symbols-outlined text-[#4d4632] opacity-0 group-hover:opacity-100 transition-opacity">
              open_in_new
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
