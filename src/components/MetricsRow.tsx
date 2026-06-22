import type { Metric } from '../types';
import MetricCard from './MetricCard';

interface MetricsRowProps {
  metrics: Metric[];
}

export default function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {metrics.map((metric) => (
        <MetricCard key={metric.label} metric={metric} />
      ))}
    </section>
  );
}
