# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `pnpm run dev` - Start development server (uses custom server.js with auto port finding)
- `pnpm run build` - Production build + sitemap generation  
- `pnpm start` - Production server
- `pnpm run lint` - ESLint linting
- `pnpm run prettier` - Code formatting

## Architecture Overview

This is a **Next.js 14 + TypeScript** application for visualizing GitHub repository star history with D3.js charts.

### Core Tech Stack
- **Next.js 14** with custom Express server (`server.js`)
- **React 18** with Context-based state management (`store/index.tsx`)
- **D3.js** for chart visualization (d3-scale, d3-selection, d3-shape)
- **Tailwind CSS** for styling
- **Axios** for GitHub API integration

### Key Architectural Patterns

**State Management**: React Context with URL hash synchronization
- State stored in `store/index.tsx` with actions pattern
- Repo list and chart mode synced with URL hash
- Client-side caching using Map-based storage

**Chart System**: Custom D3 implementation
- `shared/packages/xy-chart.tsx` - Core D3 chart component
- `shared/common/chart.tsx` - Data transformation and API orchestration
- `components/Charts/StarXYChart.tsx` - React wrapper component
- Supports two modes: Date (calendar time) and Timeline (days since first star)

**GitHub API Integration**: 
- `shared/common/api.tsx` handles pagination and rate limiting
- Token-based authentication support
- Comprehensive error handling for 401/403/404/501 responses

### Data Flow
1. URL hash → Parse repos and chart mode
2. GitHub API → Fetch star history via pagination  
3. Data transform → Convert to D3-compatible format
4. D3 render → Custom XY chart with interactive features

### Key Directories
- `components/` - React UI components (charts, dialogs, etc.)
- `shared/common/` - API integration and chart data logic
- `shared/packages/` - D3 chart implementation
- `shared/types/` - TypeScript definitions
- `store/` - React Context state management
- `helpers/` - Utilities (storage, toast, constants)

### Chart Features
- SVG export to PNG functionality
- CSV data export
- Embed code generation (iframe/SVG)
- Social sharing integration
- Mobile responsive scaling

## Development Notes

The application uses URL hash-based routing to maintain chart state and supports embedding charts in external sites via iframe or SVG.