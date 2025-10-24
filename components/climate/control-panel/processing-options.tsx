'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProcessingOptions, StatisticalMethod, CalculationType } from '@/lib/climate/types';

interface ProcessingOptionsProps {
  value: ProcessingOptions;
  onChange: (value: ProcessingOptions) => void;
}

const statisticalMethods: { value: StatisticalMethod; label: string }[] = [
  { value: 'total', label: 'Total' },
  { value: 'mean', label: 'Mean' },
  { value: 'min', label: 'Minimum' },
  { value: 'max', label: 'Maximum' },
  { value: 'median', label: 'Median' },
  { value: 'std-dev', label: 'Standard Deviation' },
];

const calculationTypes: { value: CalculationType; label: string }[] = [
  { value: 'raw', label: 'Raw Values' },
  { value: 'anomaly', label: 'Anomaly' },
  { value: 'standardized-anomaly', label: 'Standardized Anomaly' },
  { value: 'percentile', label: 'Percentile' },
];

export function ProcessingOptionsComponent({ value, onChange }: ProcessingOptionsProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Processing Options</Label>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="statistical-method" className="text-sm">Statistical Method</Label>
          <Select
            value={value.statisticalMethod}
            onValueChange={(method) =>
              onChange({ ...value, statisticalMethod: method as StatisticalMethod })
            }
          >
            <SelectTrigger id="statistical-method" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statisticalMethods.map((method) => (
                <SelectItem key={method.value} value={method.value}>
                  {method.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="calculation-type" className="text-sm">Calculation Type</Label>
          <Select
            value={value.calculationType}
            onValueChange={(type) =>
              onChange({ ...value, calculationType: type as CalculationType })
            }
          >
            <SelectTrigger id="calculation-type" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {calculationTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

