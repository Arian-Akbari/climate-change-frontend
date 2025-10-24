'use client';

import { Label } from '@/components/ui/label';
import { Grid3x3, Layers, Square } from 'lucide-react';
import type { VisualizationLayer } from '@/lib/climate/types';

interface VisualizationLayerSelectorProps {
  value: VisualizationLayer;
  onChange: (value: VisualizationLayer) => void;
}

export function VisualizationLayerSelector({ value, onChange }: VisualizationLayerSelectorProps) {
  const options: { value: VisualizationLayer; label: string; icon: React.ReactNode }[] = [
    { value: 'raster', label: 'Raster', icon: <Grid3x3 className="h-5 w-5" /> },
    { value: 'vector', label: 'Vector', icon: <Layers className="h-5 w-5" /> },
    { value: 'polygon', label: 'Polygon', icon: <Square className="h-5 w-5" /> },
  ];

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Visualization Layer</Label>
      <div className="grid grid-cols-3 gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`
              flex flex-col items-center justify-center gap-2 p-4 rounded-lg border-2 transition-all
              ${
                value === option.value
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-border bg-card hover:border-accent/50'
              }
            `}
          >
            {option.icon}
            <span className="text-sm font-medium">{option.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

