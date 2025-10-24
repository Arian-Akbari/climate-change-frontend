'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Map, Satellite, Mountain, Moon } from 'lucide-react';
import type { BaseMapType } from '@/lib/climate/types';

interface BaseMapSwitcherProps {
  value: BaseMapType;
  onChange: (value: BaseMapType) => void;
}

const baseMaps: { value: BaseMapType; label: string; icon: React.ReactNode }[] = [
  { value: 'street', label: 'Street Map', icon: <Map className="h-4 w-4" /> },
  { value: 'satellite', label: 'Satellite', icon: <Satellite className="h-4 w-4" /> },
  { value: 'terrain', label: 'Terrain', icon: <Mountain className="h-4 w-4" /> },
  { value: 'dark', label: 'Dark Mode', icon: <Moon className="h-4 w-4" /> },
];

export function BaseMapSwitcher({ value, onChange }: BaseMapSwitcherProps) {
  return (
    <div className="absolute top-4 right-4 z-[1000] bg-card rounded-lg shadow-lg border border-border">
      <Select value={value} onValueChange={(val) => onChange(val as BaseMapType)}>
        <SelectTrigger className="w-40">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {baseMaps.map((map) => (
            <SelectItem key={map.value} value={map.value}>
              <div className="flex items-center gap-2">
                {map.icon}
                <span>{map.label}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

