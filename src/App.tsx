import { useRef } from 'react';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import WelcomeSection from './components/WelcomeSection';
import MetricsRow from './components/MetricsRow';
import SkillPulse from './components/SkillPulse';
import ActiveStream from './components/ActiveStream';
import SidePanel from './components/SidePanel';
import BadgesSection from './components/BadgesSection';
import ProofPortfolio from './components/ProofPortfolio';
import TelemetryFeed from './components/TelemetryFeed';
import { navItems, metrics, skills, badges, portfolioItems, telemetryEntries, heatmapOpacities } from './data/dashboard';
import './index.css';

export default function App() {
  const bentoRef = useRef<HTMLDivElement>(null);

  const handleBentoHover = (e: React.MouseEvent<HTMLDivElement>, enter: boolean) => {
    const target = e.currentTarget as HTMLDivElement;
    target.style.transform = enter ? 'translateY(-2px)' : 'translateY(0)';
    target.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#fbf9f1]" style={{ fontFamily: 'Inter, sans-serif', color: '#0a192f' }}>
      <Sidebar navItems={navItems} />

      <main className="flex-1 overflow-y-auto relative dot-matrix">
        <TopBar />

        <div className="p-6 max-w-[1280px] mx-auto space-y-10 pb-16">
          <WelcomeSection />
          <MetricsRow metrics={metrics} />

          {/* Bento Grid */}
          <div className="bento-grid" ref={bentoRef}>
            {/* Left Column */}
            <div
              className="col-span-12 lg:col-span-8 space-y-6"
              onMouseEnter={(e) => handleBentoHover(e, true)}
              onMouseLeave={(e) => handleBentoHover(e, false)}
            >
              <SkillPulse skills={skills} />
              <ActiveStream />
            </div>

            {/* Right Column */}
            <div
              onMouseEnter={(e) => handleBentoHover(e, true)}
              onMouseLeave={(e) => handleBentoHover(e, false)}
            >
              <SidePanel heatmap={heatmapOpacities} />
            </div>
          </div>

          <div className="border-t border-[rgba(127,118,96,0.15)] pt-10" />

          {/* Bottom: Badges + Portfolio */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-16">
            <BadgesSection badges={badges} />
            <ProofPortfolio items={portfolioItems} />
          </section>

          <TelemetryFeed entries={telemetryEntries} />
        </div>
      </main>
    </div>
  );
}
