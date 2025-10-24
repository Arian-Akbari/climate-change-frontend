'use client';

import { Card } from '@/components/ui/card';
import type { ClimateStatistics, SelectedVariable } from '@/lib/climate/types';

interface IndexStatisticsProps {
  statistics: ClimateStatistics | null;
  variable: SelectedVariable;
}

export function IndexStatistics({ statistics, variable }: IndexStatisticsProps) {
  if (!statistics) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        Click "COMPUTE MAP" to view statistics
      </div>
    );
  }

  const stats = [
    {
      label: 'Average',
      value: statistics.average.toFixed(2),
      subtitle: `Std Dev: ${statistics.stdDev.toFixed(2)}`,
    },
    {
      label: 'Minimum',
      value: statistics.min.toFixed(2),
      subtitle: `Data points: ${statistics.count}`,
    },
    {
      label: 'Maximum',
      value: statistics.max.toFixed(2),
      subtitle: `95th Percentile: ${statistics.percentile95.toFixed(2)}`,
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="p-4 border-border">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">{stat.label}</div>
            <div className="text-3xl font-bold">
              {stat.value} <span className="text-lg font-normal text-muted-foreground">{variable.units}</span>
            </div>
            <div className="text-xs text-muted-foreground">{stat.subtitle}</div>
          </div>
        </Card>
      ))}
    </div>
  );
}

