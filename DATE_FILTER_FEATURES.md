# Date Filter and Zoom Features

## Overview
This implementation adds two new features to the GitHub Star History chart:

1. **Date Filter**: Allows users to filter chart data from a specific date onwards
2. **Zoom Controls**: Provides zoom in/out functionality for better chart exploration

## Features

### Date Filter
- **Date From Field**: A date input field that allows users to select a start date
- **Clear Button**: A button to clear the date filter and show all data
- **Real-time Filtering**: Chart updates immediately when a date is selected
- **Backend Support**: The SVG API endpoint now supports a `dateFrom` parameter

### Zoom Controls
- **Zoom In/Out Buttons**: Buttons to increase/decrease zoom level
- **Reset Button**: Button to reset zoom to default level (1x)
- **Zoom Limits**: Zoom level is constrained between 0.5x and 3x
- **Responsive**: Works with existing mobile scaling

## Implementation Details

### Frontend Changes

#### Store Updates (`frontend/store/index.tsx`)
- Added `dateFrom: string | null` to AppState
- Added `zoomLevel: number` to AppState
- Added corresponding actions: `setDateFrom` and `setZoomLevel`

#### New Components
- **DateFilter.tsx**: Date input component with clear functionality
- **ZoomControls.tsx**: Zoom control buttons with state management

#### Updated Components
- **StarChartViewer.tsx**: 
  - Integrated DateFilter and ZoomControls components
  - Updated data fetching to include date filtering
  - Added zoom level state management
- **StarXYChart.tsx**: 
  - Added zoom level prop support
  - Updated scaling logic to include zoom level

### Backend Changes

#### API Updates (`backend/main.ts`)
- Added `dateFrom` parameter support to `/svg` endpoint
- Updated chart generation to use filtered data

#### Chart Utilities (`backend/shared/common/chart.tsx`)
- Updated `convertDataToChartData` function to accept `dateFrom` parameter
- Added date filtering logic for both Date and Timeline modes

## Usage

### Date Filter
1. Enter a repository name to load star history data
2. Use the "Date from" field to select a start date
3. The chart will automatically filter to show only data from that date onwards
4. Click "Clear" to remove the filter and show all data

### Zoom Controls
1. Use the "+" button to zoom in (up to 3x)
2. Use the "-" button to zoom out (down to 0.5x)
3. Click "Reset" to return to default zoom level (1x)

## API Usage

The SVG endpoint now supports a `dateFrom` parameter:

```
GET /svg?repos=owner/repo&type=Date&dateFrom=2023-01-01
```

This will generate a chart showing only data from January 1, 2023 onwards.

## Technical Notes

- Date filtering works with both "Date" and "Timeline" chart modes
- Zoom controls work in conjunction with existing mobile responsive scaling
- All changes are backward compatible
- The date filter state is preserved during chart mode switches
- Zoom level is maintained when switching between repositories 