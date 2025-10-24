'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Calendar } from 'lucide-react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import type { TimeRange } from '@/lib/climate/types';

interface TimePeriodSelectorProps {
  value: TimeRange;
  onChange: (value: TimeRange) => void;
}

const presets = [
  { label: 'Last 30 Days', days: 30 },
  { label: 'Last 60 Days', days: 60 },
  { label: 'Last 90 Days', days: 90 },
  { label: 'Last Year', days: 365 },
  { label: 'Last 5 Years', days: 1825 },
];

export function TimePeriodSelector({ value, onChange }: TimePeriodSelectorProps) {
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);

  function handlePresetClick(days: number, label: string) {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    setSelectedPreset(label);
    onChange({
      startDate,
      endDate,
      preset: label,
    });
  }

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Time Period Selection</Label>
      </div>

      <div className="bg-muted/50 rounded-lg p-3">
        <Label className="text-xs text-muted-foreground">Period of Record</Label>
        <p className="text-sm font-medium mt-1">Data available: 2000-01-01 to 2024-10-24</p>
      </div>

      <div>
        <Label className="text-sm mb-2 block">Quick Select</Label>
        <div className="grid grid-cols-2 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.label}
              variant={selectedPreset === preset.label ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetClick(preset.days, preset.label)}
              className={selectedPreset === preset.label ? 'bg-accent hover:bg-accent/90' : ''}
            >
              {preset.label}
            </Button>
          ))}
          <Button
            variant={selectedPreset === 'Custom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPreset('Custom')}
            className={`col-span-2 ${selectedPreset === 'Custom' ? 'bg-accent hover:bg-accent/90' : ''}`}
          >
            Custom Range
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="start-date" className="text-sm">Start Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="start-date"
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1.5"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value.startDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DayPicker
                mode="single"
                selected={value.startDate}
                onSelect={(date) => {
                  if (date) {
                    onChange({ ...value, startDate: date });
                    setSelectedPreset('Custom');
                  }
                }}
                disabled={(date) => date > value.endDate || date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div>
          <Label htmlFor="end-date" className="text-sm">End Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="end-date"
                variant="outline"
                className="w-full justify-start text-left font-normal mt-1.5"
              >
                <Calendar className="mr-2 h-4 w-4" />
                {value.endDate.toLocaleDateString()}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <DayPicker
                mode="single"
                selected={value.endDate}
                onSelect={(date) => {
                  if (date) {
                    onChange({ ...value, endDate: date });
                    setSelectedPreset('Custom');
                  }
                }}
                disabled={(date) => date < value.startDate || date > new Date()}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}

