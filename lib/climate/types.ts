export type VisualizationLayer = 'raster' | 'vector' | 'polygon';

export type DataType = 
  | 'climate-hydrology'
  | 'temperature'
  | 'precipitation'
  | 'wind'
  | 'soil-moisture'
  | 'humidity'
  | 'solar-radiation';

export type StatisticalMethod = 
  | 'total'
  | 'mean'
  | 'min'
  | 'max'
  | 'median'
  | 'std-dev';

export type CalculationType = 
  | 'raw'
  | 'anomaly'
  | 'standardized-anomaly'
  | 'percentile';

export type Units = 
  | 'mm'
  | 'celsius'
  | 'fahrenheit'
  | 'meters-per-second'
  | 'percent'
  | 'w-per-m2';

export interface SelectedVariable {
  dataType: DataType;
  dataset: string;
  variable: string;
  units: Units;
  resolution: string;
}

export interface ProcessingOptions {
  statisticalMethod: StatisticalMethod;
  calculationType: CalculationType;
}

export interface TimeRange {
  startDate: Date;
  endDate: Date;
  preset?: string;
}

export interface ClimateStatistics {
  average: number;
  min: number;
  max: number;
  stdDev: number;
  count: number;
  percentile95: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  unit: string;
}

export interface GeoJSONFeature {
  type: 'Feature';
  geometry: {
    type: 'Polygon';
    coordinates: number[][][];
  };
  properties: {
    value: number;
    unit: string;
    color: string;
  };
}

export interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: GeoJSONFeature[];
}

export type BaseMapType = 'street' | 'satellite' | 'terrain' | 'dark';

