import type { NavItem, Metric, Skill, Badge, PortfolioItem, TelemetryEntry, HeatmapCell } from '../types';

export const navItems: NavItem[] = [
  { icon: 'view_module', label: 'Modules', active: true },
  { icon: 'science', label: 'Labs' },
  { icon: 'groups', label: 'Community', href: 'https://epic.ycenter.co', external: true },
  { icon: 'school', label: 'Courses' },
];

export const metrics: Metric[] = [
  {
    label: 'Chats Completed',
    value: 42,
    badge: '+12%',
    cta: { label: '+ New Chat', href: '#' },
  },
  {
    label: 'Avg. PSQ Score',
    value: 8.4,
    subLabel: 'High Kinetic Potential',
    progress: 84,
  },
  {
    label: 'Pathway Progress',
    value: '68%',
    subLabel: 'You are doing 15% better than last week',
    progress: 68,
  },
];

export const skills: Skill[] = [
  { label: 'Creativity', value: 85 },
  { label: 'Empathy', value: 65 },
  { label: 'Systems', value: 45 },
  { label: 'Logic', value: 75 },
  { label: 'Evidence', value: 90 },
];

export const badges: Badge[] = [
  {
    icon: 'verified',
    iconColor: 'text-primary-container',
    label: 'Entrepreneurship',
    bgClass: 'bg-on-surface',
    textClass: 'text-surface',
    tilt: 'tilt',
  },
  {
    icon: 'public',
    iconColor: 'text-secondary',
    label: 'Social Impact',
    bgClass: 'bg-surface-container-highest',
    textClass: 'text-on-surface',
    tilt: 'tilt-alt',
  },
  {
    icon: 'brush',
    iconColor: '',
    label: 'Design Thinking',
    bgClass: 'bg-primary-container',
    textClass: 'text-on-primary-container',
    tilt: 'tilt',
  },
];

export const portfolioItems: PortfolioItem[] = [
  { id: '01', label: 'Problem Synthesis' },
  { id: '02', label: 'Evidence Logic' },
];

export const telemetryEntries: TelemetryEntry[] = [
  {
    timestamp: '10:14:22',
    type: 'log',
    content: 'Daily streak sequence verified:',
    highlight: 'Day 12 Active',
  },
  {
    timestamp: '09:30:05',
    type: 'log',
    content: 'Goal achieved:',
    highlight: '"Problem Definition" Artifact Published',
  },
  {
    timestamp: 'Yesterday',
    type: 'note',
    content:
      '"Maya, your synthesis of the Urban Farming water waste problem shows strong divergent thinking. Suggest focusing next on specific irrigation hardware constraints."',
    noteAuthor: 'AI Coach Aris',
  },
];

export const heatmapOpacities: HeatmapCell[] = [
  20, 40, 10, 100, 60, 20, 80, 30, 50, 90, 10, 40, 70, 20, 50,
  10, 80, 30, 60, 90, 40, 10, 70, 20, 50, 10, 80, 30,
].map((opacity) => ({ opacity }));
