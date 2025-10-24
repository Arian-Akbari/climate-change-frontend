'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { SplitLayout } from '@/components/climate/layout/split-layout';
import { Sidebar } from '@/components/climate/layout/sidebar';
import { VisualizationLayerSelector } from '@/components/climate/control-panel/visualization-layer-selector';
import { VariableSelector } from '@/components/climate/control-panel/variable-selector';
import { ProcessingOptionsComponent } from '@/components/climate/control-panel/processing-options';
import { MaskingOptions } from '@/components/climate/control-panel/masking-options';
import { TimePeriodSelector } from '@/components/climate/control-panel/time-period-selector';
import { ActionButtons } from '@/components/climate/control-panel/action-buttons';
import { BaseMapSwitcher } from '@/components/climate/map-view/base-map-switcher';
import { Legend } from '@/components/climate/map-view/legend';
import { IndexStatistics } from '@/components/climate/statistics-panel/index-statistics';
import { DataCharts } from '@/components/climate/statistics-panel/data-charts';
import { Separator } from '@/components/ui/separator';
import {
  generateMockOverlays,
  generateMockStatistics,
  generateMockChartData,
  generateTimeSeriesData,
} from '@/lib/climate/mock-data';
import type {
  VisualizationLayer,
  SelectedVariable,
  ProcessingOptions,
  TimeRange,
  GeoJSONCollection,
  ClimateStatistics,
  ChartDataPoint,
  BaseMapType,
} from '@/lib/climate/types';

const ClimateMap = dynamic(
  () => import('@/components/climate/map-view/climate-map').then((mod) => mod.ClimateMap),
  { ssr: false }
);

export default function ClimatePage() {
  const [visualizationLayer, setVisualizationLayer] = useState<VisualizationLayer>('polygon');
  const [selectedVariable, setSelectedVariable] = useState<SelectedVariable>({
    dataType: 'precipitation',
    dataset: 'CHIRPS Precipitation',
    variable: 'Total Precipitation',
    units: 'mm',
    resolution: '5km x 5km',
  });
  const [processingOptions, setProcessingOptions] = useState<ProcessingOptions>({
    statisticalMethod: 'mean',
    calculationType: 'raw',
  });
  const [maskingEnabled, setMaskingEnabled] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>({
    startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
    endDate: new Date(),
  });
  const [baseMapType, setBaseMapType] = useState<BaseMapType>('street');
  
  const [isComputing, setIsComputing] = useState(false);
  const [mapOverlays, setMapOverlays] = useState<GeoJSONCollection | null>(null);
  const [statistics, setStatistics] = useState<ClimateStatistics | null>(null);
  const [chartData, setChartData] = useState<{
    bar: ChartDataPoint[];
    line: ChartDataPoint[];
    area: ChartDataPoint[];
  }>({ bar: [], line: [], area: [] });

  function handleCompute() {
    setIsComputing(true);
    
    setTimeout(() => {
      const overlays = generateMockOverlays(selectedVariable, timeRange);
      const stats = generateMockStatistics(selectedVariable);
      const barData = generateMockChartData(selectedVariable, timeRange, 'bar');
      const lineData = generateTimeSeriesData(selectedVariable, 30);
      const areaData = generateMockChartData(selectedVariable, timeRange, 'area');
      
      setMapOverlays(overlays);
      setStatistics(stats);
      setChartData({ bar: barData, line: lineData, area: areaData });
      setIsComputing(false);
    }, 2000);
  }

  function handleReset() {
    setVisualizationLayer('polygon');
    setSelectedVariable({
      dataType: 'precipitation',
      dataset: 'CHIRPS Precipitation',
      variable: 'Total Precipitation',
      units: 'mm',
      resolution: '5km x 5km',
    });
    setProcessingOptions({
      statisticalMethod: 'mean',
      calculationType: 'raw',
    });
    setMaskingEnabled(false);
    setTimeRange({
      startDate: new Date(new Date().setDate(new Date().getDate() - 30)),
      endDate: new Date(),
    });
    setBaseMapType('street');
    setMapOverlays(null);
    setStatistics(null);
    setChartData({ bar: [], line: [], area: [] });
  }

  function handleExport() {
    console.log('Export functionality not implemented');
  }

  const sidebarContent = (
    <Sidebar>
      <VisualizationLayerSelector value={visualizationLayer} onChange={setVisualizationLayer} />
      <Separator />
      <VariableSelector value={selectedVariable} onChange={setSelectedVariable} />
      <Separator />
      <ProcessingOptionsComponent value={processingOptions} onChange={setProcessingOptions} />
      <Separator />
      <MaskingOptions enabled={maskingEnabled} onEnabledChange={setMaskingEnabled} />
      <Separator />
      <TimePeriodSelector value={timeRange} onChange={setTimeRange} />
      <Separator />
      <ActionButtons
        onCompute={handleCompute}
        onReset={handleReset}
        onExport={handleExport}
        isComputing={isComputing}
      />
    </Sidebar>
  );

  const mapContent = (
    <>
      <ClimateMap overlays={mapOverlays} baseMapType={baseMapType} />
      <BaseMapSwitcher value={baseMapType} onChange={setBaseMapType} />
      {mapOverlays && statistics && (
        <Legend
          variable={selectedVariable}
          minValue={statistics.min}
          maxValue={statistics.max}
        />
      )}
    </>
  );

  const statisticsContent = (
    <div className="p-6 max-h-96 overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Statistics & Analysis</h2>
      <div className="space-y-6">
        <IndexStatistics statistics={statistics} variable={selectedVariable} />
        {chartData.bar.length > 0 && (
          <>
            <Separator className="my-6" />
            <DataCharts
              barData={chartData.bar}
              lineData={chartData.line}
              areaData={chartData.area}
            />
          </>
        )}
      </div>
    </div>
  );

  return (
    <SplitLayout
      sidebar={sidebarContent}
      map={mapContent}
      statistics={statisticsContent}
    />
  );
}

