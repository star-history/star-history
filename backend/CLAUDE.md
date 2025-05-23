# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `pnpm dev` - Start development server with hot reload using tsx
- `pnpm build` - Build TypeScript project

### Requirements
- Requires `token.env` file with GitHub tokens (one per line) for API access
- For local dev: Set `ENVPATH` environment variable to token file location
- Production: Uses `./token.env` file

## Architecture

This is a Koa.js backend server that generates SVG charts of GitHub repository star history.

### Core Flow
1. **Token Management** (`token.ts`): Validates and rotates GitHub API tokens from environment file
2. **API Requests** (`shared/common/api.tsx`): Fetches star history data from GitHub API 
3. **Caching** (`cache.ts`): LRU cache (10K repos, 1GB max, 24h TTL) for star records and logo URLs
4. **Chart Generation** (`shared/packages/xy-chart.js`): D3-based SVG chart rendering via JSDOM
5. **SVG Optimization**: Uses SVGO to minimize bandwidth

### Key Components
- **Main Server** (`main.ts`): Single `/svg` endpoint that accepts query params (repos, type, size, theme, transparent)
- **Data Processing** (`shared/common/chart.tsx`): Converts API data to chart format, handles Date vs Timeline modes
- **Utilities** (`utils.ts`): Image conversion, SVG manipulation, size calculations

### Shared Directory
The `shared/` directory contains code shared with the frontend:
- `common/`: API clients, chart data processing, utilities
- `packages/`: Chart rendering components (xy-chart)
- `types/`: TypeScript definitions for chart data structures

### Chart Types
- **Date Mode**: X-axis shows actual dates
- **Timeline Mode**: X-axis shows relative time from repo creation
- Supports multiple chart sizes and light/dark themes