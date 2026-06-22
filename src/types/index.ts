export interface NavItem {
  icon: string;
  label: string;
  active?: boolean;
  href?: string;
  external?: boolean;
}

export interface Metric {
  label: string;
  value: string | number;
  badge?: string;
  subLabel?: string;
  progress?: number;
  cta?: { label: string; href: string };
}

export interface Skill {
  label: string;
  value: number; // 0-100
}

export interface Badge {
  icon: string;
  iconColor: string;
  label: string;
  bgClass: string;
  textClass: string;
  tilt: 'tilt' | 'tilt-alt';
}

export interface PortfolioItem {
  id: string;
  label: string;
}

export interface TelemetryEntry {
  timestamp: string;
  type: 'log' | 'note';
  content: string;
  highlight?: string;
  noteAuthor?: string;
}

export interface HeatmapCell {
  opacity: number;
}
