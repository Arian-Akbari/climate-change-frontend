'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MaskingOptionsProps {
  enabled: boolean;
  onEnabledChange: (enabled: boolean) => void;
}

const regions = [
  'North America',
  'South America',
  'Europe',
  'Asia',
  'Africa',
  'Australia',
  'Custom Region',
];

export function MaskingOptions({ enabled, onEnabledChange }: MaskingOptionsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedRegion, setSelectedRegion] = useState(regions[0]);

  return (
    <div className="space-y-3">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between w-full text-left"
      >
        <Label className="text-base font-semibold cursor-pointer">Masking Options</Label>
        {isExpanded ? (
          <ChevronUp className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="space-y-3 pl-1">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="enable-masking"
              checked={enabled}
              onChange={(e) => onEnabledChange(e.target.checked)}
              className="w-4 h-4 rounded border-border text-primary focus:ring-2 focus:ring-ring"
            />
            <Label htmlFor="enable-masking" className="text-sm cursor-pointer">
              Apply geographical mask
            </Label>
          </div>

          {enabled && (
            <div>
              <Label htmlFor="region" className="text-sm">Region</Label>
              <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                <SelectTrigger id="region" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {regions.map((region) => (
                    <SelectItem key={region} value={region}>
                      {region}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

