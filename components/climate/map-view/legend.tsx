'use client';

import type { SelectedVariable } from '@/lib/climate/types';

interface LegendProps {
  variable: SelectedVariable;
  minValue: number;
  maxValue: number;
}

export function Legend({ variable, minValue, maxValue }: LegendProps) {
  const isTemperature = variable.dataType === 'temperature';
  const isPrecipitation = variable.dataType === 'precipitation';
  
  const colors = isTemperature
    ? ['#0c7bb3', '#38bdf8', '#e2e8f0', '#fb923c', '#ef4444']
    : isPrecipitation
    ? ['#d1fae5', '#86efac', '#4ade80', '#16a34a', '#15803d']
    : ['#d1fae5', '#86efac', '#4ade80', '#16a34a', '#15803d'];

  const steps = colors.length;
  const range = maxValue - minValue;
  const stepSize = range / (steps - 1);

  return (
    <div className="absolute bottom-8 right-4 z-[1000] bg-card rounded-lg shadow-lg border border-border p-4 min-w-[200px]">
      <div className="text-sm font-semibold mb-2">{variable.variable}</div>
      
      <div className="space-y-1">
        {colors.map((color, index) => {
          const value = minValue + stepSize * index;
          return (
            <div key={index} className="flex items-center gap-2">
              <div
                className="w-6 h-4 rounded border border-border"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs">
                {value.toFixed(1)} {variable.units}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

