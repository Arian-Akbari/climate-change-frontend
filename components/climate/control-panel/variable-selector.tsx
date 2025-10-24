'use client';

import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { SelectedVariable, DataType, Units } from '@/lib/climate/types';

interface VariableSelectorProps {
  value: SelectedVariable;
  onChange: (value: SelectedVariable) => void;
}

const dataTypes: { value: DataType; label: string }[] = [
  { value: 'climate-hydrology', label: 'Climate & Hydrology' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'precipitation', label: 'Precipitation' },
  { value: 'wind', label: 'Wind' },
  { value: 'soil-moisture', label: 'Soil Moisture' },
  { value: 'humidity', label: 'Humidity' },
  { value: 'solar-radiation', label: 'Solar Radiation' },
];

const datasets: Record<DataType, string[]> = {
  'climate-hydrology': ['Global Climate Dataset', 'Regional Hydrology Model', 'ERA5 Reanalysis'],
  'temperature': ['MODIS Temperature', 'NOAA Temperature Grid', 'WorldClim Temperature'],
  'precipitation': ['CHIRPS Precipitation', 'GPM IMERG', 'TRMM 3B42'],
  'wind': ['ERA5 Wind Data', 'NOAA Wind Analysis', 'MERRA-2 Wind'],
  'soil-moisture': ['SMAP Soil Moisture', 'ESA CCI Soil Moisture', 'SMOS Level 3'],
  'humidity': ['ERA5 Humidity', 'AIRS Humidity', 'MERRA-2 Humidity'],
  'solar-radiation': ['CERES Solar', 'GLASS Radiation', 'ERA5 Solar'],
};

const variables: Record<DataType, string[]> = {
  'climate-hydrology': ['Evapotranspiration', 'Runoff', 'Water Balance'],
  'temperature': ['Temperature Min', 'Temperature Max', 'Temperature Mean'],
  'precipitation': ['Total Precipitation', 'Rainfall Intensity', 'Snow Depth'],
  'wind': ['Wind Speed', 'Wind Direction', 'Wind Gusts'],
  'soil-moisture': ['Surface Soil Moisture', 'Root Zone Moisture', 'Saturation'],
  'humidity': ['Relative Humidity', 'Specific Humidity', 'Dew Point'],
  'solar-radiation': ['Shortwave Radiation', 'Longwave Radiation', 'Net Radiation'],
};

const units: Record<DataType, Units[]> = {
  'climate-hydrology': ['mm', 'meters-per-second'],
  'temperature': ['celsius', 'fahrenheit'],
  'precipitation': ['mm'],
  'wind': ['meters-per-second'],
  'soil-moisture': ['percent'],
  'humidity': ['percent'],
  'solar-radiation': ['w-per-m2'],
};

export function VariableSelector({ value, onChange }: VariableSelectorProps) {
  const availableDatasets = datasets[value.dataType] || [];
  const availableVariables = variables[value.dataType] || [];
  const availableUnits = units[value.dataType] || ['mm'];

  return (
    <div className="space-y-4">
      <div>
        <Label className="text-base font-semibold">Variable Selection</Label>
      </div>

      <div className="space-y-3">
        <div>
          <Label htmlFor="data-type" className="text-sm">Data Type</Label>
          <Select
            value={value.dataType}
            onValueChange={(dataType) =>
              onChange({
                ...value,
                dataType: dataType as DataType,
                dataset: datasets[dataType as DataType][0],
                variable: variables[dataType as DataType][0],
                units: units[dataType as DataType][0],
              })
            }
          >
            <SelectTrigger id="data-type" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dataTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="dataset" className="text-sm">Dataset</Label>
          <Select
            value={value.dataset}
            onValueChange={(dataset) => onChange({ ...value, dataset })}
          >
            <SelectTrigger id="dataset" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableDatasets.map((dataset) => (
                <SelectItem key={dataset} value={dataset}>
                  {dataset}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="variable" className="text-sm">Variable</Label>
          <Select
            value={value.variable}
            onValueChange={(variable) => onChange({ ...value, variable })}
          >
            <SelectTrigger id="variable" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableVariables.map((variable) => (
                <SelectItem key={variable} value={variable}>
                  {variable}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="units" className="text-sm">Units</Label>
          <Select
            value={value.units}
            onValueChange={(units) => onChange({ ...value, units: units as Units })}
          >
            <SelectTrigger id="units" className="mt-1.5">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {availableUnits.map((unit) => (
                <SelectItem key={unit} value={unit}>
                  {unit}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-muted/50 rounded-lg p-3">
          <Label className="text-xs text-muted-foreground">Resolution</Label>
          <p className="text-sm font-medium mt-1">{value.resolution}</p>
        </div>
      </div>
    </div>
  );
}

