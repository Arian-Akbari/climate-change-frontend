# Climate Data Visualization Platform

A frontend-only climate data visualization platform with an interactive mapping interface for exploring climate and environmental data.

## Features

- **Interactive Map Visualization**: React-Leaflet powered map with multiple base layers
- **Data Configuration Panel**: Select data types, variables, time periods, and processing options
- **Statistical Analysis**: Real-time statistics and charts for selected data
- **Multiple Base Maps**: Street, Satellite, Terrain, and Dark mode views
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Mock Data**: Pre-populated sample data for demonstration purposes

## Technology Stack

### Frontend

- **Next.js 15**: App Router architecture
- **React 19**: Component-based UI
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **React-Leaflet**: Lightweight map visualization
- **Recharts**: Data visualization charts

### UI Components

- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Day Picker**: Date selection

## Getting Started

### Prerequisites

- Node.js (v18.x or higher)
- npm or pnpm

### Installation

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

The app will redirect to `/climate` where you can interact with the visualization platform.

## Project Structure

```
├── app/
│   ├── climate/              # Climate visualization route
│   │   ├── page.tsx         # Main climate page
│   │   └── layout.tsx       # Climate layout
│   ├── globals.css          # Global styles with climate palette
│   └── layout.tsx           # Root layout
├── components/
│   ├── climate/
│   │   ├── layout/          # Layout components
│   │   ├── control-panel/   # Left sidebar controls
│   │   ├── map-view/        # Map and visualization
│   │   └── statistics-panel/ # Bottom statistics
│   └── ui/                  # Reusable UI components
└── lib/
    └── climate/
        ├── types.ts         # TypeScript types
        └── mock-data.ts     # Mock data generators
```

## Architecture

┌─────────────────┐
│ Control Panel │ (Left Sidebar)
│ - Layer Select │
│ - Variables │
│ - Time Period │
│ - Actions │
└────────┬────────┘
│
▼
┌─────────────────┐
│ Map View │ (Right Panel)
│ - Leaflet Map │
│ - Overlays │
│ - Legend │
└────────┬────────┘
│
▼
┌─────────────────┐
│ Statistics │ (Bottom Panel)
│ - Index Stats │
│ - Charts │
└─────────────────┘

## Usage

1. Select visualization layer (Raster/Vector/Polygon)
2. Choose data type and variable
3. Set processing options and time period
4. Click "COMPUTE MAP" to visualize
5. View results on map with color-coded overlays
6. Review statistics and charts in bottom panel
