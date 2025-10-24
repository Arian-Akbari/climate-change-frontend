import type {
  GeoJSONCollection,
  ClimateStatistics,
  ChartDataPoint,
  SelectedVariable,
  TimeRange,
} from './types';

export function generateMockOverlays(
  variable: SelectedVariable,
  timeRange: TimeRange
): GeoJSONCollection {
  const isTemperature = variable.dataType === 'temperature';
  const isPrecipitation = variable.dataType === 'precipitation';
  
  const colors = isTemperature
    ? ['#0c7bb3', '#38bdf8', '#e2e8f0', '#fb923c', '#ef4444']
    : isPrecipitation
    ? ['#d1fae5', '#86efac', '#4ade80', '#16a34a', '#15803d']
    : ['#16a34a', '#0ea5e9', '#ef4444', '#eab308', '#a855f7'];

  const features = [];
  const baseLatitude = 35;
  const baseLongitude = -95;

  for (let i = 0; i < 20; i++) {
    const latOffset = (i % 5) * 2;
    const lonOffset = Math.floor(i / 5) * 3;
    
    const value = isTemperature
      ? Math.random() * 30 + 10
      : isPrecipitation
      ? Math.random() * 100
      : Math.random() * 50;

    const colorIndex = Math.floor((value / (isTemperature ? 40 : isPrecipitation ? 100 : 50)) * colors.length);
    const color = colors[Math.min(colorIndex, colors.length - 1)];

    features.push({
      type: 'Feature' as const,
      geometry: {
        type: 'Polygon' as const,
        coordinates: [[
          [baseLongitude + lonOffset, baseLatitude + latOffset],
          [baseLongitude + lonOffset + 2.5, baseLatitude + latOffset],
          [baseLongitude + lonOffset + 2.5, baseLatitude + latOffset + 1.8],
          [baseLongitude + lonOffset, baseLatitude + latOffset + 1.8],
          [baseLongitude + lonOffset, baseLatitude + latOffset],
        ]],
      },
      properties: {
        value: parseFloat(value.toFixed(1)),
        unit: variable.units,
        color,
      },
    });
  }

  return {
    type: 'FeatureCollection',
    features,
  };
}

export function generateMockStatistics(variable: SelectedVariable): ClimateStatistics {
  const isTemperature = variable.dataType === 'temperature';
  const isPrecipitation = variable.dataType === 'precipitation';
  
  const baseValue = isTemperature ? 25 : isPrecipitation ? 45 : 30;
  const variance = isTemperature ? 8 : isPrecipitation ? 20 : 15;

  return {
    average: baseValue + (Math.random() * 5 - 2.5),
    min: baseValue - variance,
    max: baseValue + variance,
    stdDev: Math.random() * 5 + 2,
    count: Math.floor(Math.random() * 5000) + 1000,
    percentile95: baseValue + variance * 0.7,
  };
}

export function generateMockChartData(
  variable: SelectedVariable,
  timeRange: TimeRange,
  chartType: 'bar' | 'line' | 'area'
): ChartDataPoint[] {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const isTemperature = variable.dataType === 'temperature';
  const isPrecipitation = variable.dataType === 'precipitation';
  
  const baseValue = isTemperature ? 20 : isPrecipitation ? 50 : 35;

  return months.map((month, index) => {
    const seasonalVariation = isTemperature 
      ? Math.sin((index / 12) * Math.PI * 2) * 10
      : isPrecipitation
      ? Math.cos((index / 12) * Math.PI * 2) * 30
      : 0;
    
    return {
      date: month,
      value: parseFloat((baseValue + seasonalVariation + (Math.random() * 10 - 5)).toFixed(1)),
      unit: variable.units,
    };
  });
}

export function generateTimeSeriesData(
  variable: SelectedVariable,
  days: number = 30
): ChartDataPoint[] {
  const data: ChartDataPoint[] = [];
  const now = new Date();
  const isTemperature = variable.dataType === 'temperature';
  const isPrecipitation = variable.dataType === 'precipitation';
  
  const baseValue = isTemperature ? 22 : isPrecipitation ? 45 : 30;

  for (let i = 0; i < days; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (days - i));
    
    const trend = (i / days) * (Math.random() * 4 - 2);
    const noise = Math.random() * 6 - 3;
    
    data.push({
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: parseFloat((baseValue + trend + noise).toFixed(1)),
      unit: variable.units,
    });
  }

  return data;
}

