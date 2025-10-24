'use client';

import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import type { GeoJSONCollection, BaseMapType } from '@/lib/climate/types';
import 'leaflet/dist/leaflet.css';

interface ClimateMapProps {
  overlays: GeoJSONCollection | null;
  baseMapType: BaseMapType;
  children?: React.ReactNode;
}

const baseMaps: Record<BaseMapType, { url: string; attribution: string }> = {
  street: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
  },
  satellite: {
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
  },
  terrain: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    attribution: 'Map data: &copy; OpenTopoMap contributors',
  },
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; CartoDB',
  },
};

function MapUpdater({ baseMapType }: { baseMapType: BaseMapType }) {
  const map = useMap();
  
  useEffect(() => {
    map.eachLayer((layer) => {
      if (layer instanceof (window as any).L.TileLayer) {
        map.removeLayer(layer);
      }
    });
    
    const tileLayer = new (window as any).L.TileLayer(
      baseMaps[baseMapType].url,
      {
        attribution: baseMaps[baseMapType].attribution,
        maxZoom: 18,
      }
    );
    
    tileLayer.addTo(map);
    tileLayer.setZIndex(0);
  }, [baseMapType, map]);
  
  return null;
}

export function ClimateMap({ overlays, baseMapType, children }: ClimateMapProps) {
  const mapRef = useRef<LeafletMap | null>(null);

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={[40, -95]}
        zoom={4}
        className="h-full w-full z-0"
        ref={mapRef}
      >
        <TileLayer
          url={baseMaps[baseMapType].url}
          attribution={baseMaps[baseMapType].attribution}
        />
        <MapUpdater baseMapType={baseMapType} />
        
        {overlays?.features.map((feature, index) => {
          const positions = feature.geometry.coordinates[0].map(
            (coord: number[]) => [coord[1], coord[0]] as [number, number]
          );
          
          return (
            <Polygon
              key={index}
              positions={positions}
              pathOptions={{
                fillColor: feature.properties.color,
                fillOpacity: 0.6,
                color: feature.properties.color,
                weight: 1,
                opacity: 0.8,
              }}
            />
          );
        })}
        
        {children}
      </MapContainer>
    </div>
  );
}

