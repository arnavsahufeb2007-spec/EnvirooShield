# EnviroShield — Environmental Intelligence Dashboard

**Student project | Air-quality visualization | React + TypeScript**

EnviroShield is a data-focused environmental dashboard project exploring how air quality, atmospheric conditions and forecasts can be translated into useful, understandable information.

[Portfolio overview](PORTFOLIO.md)

## Overview
The interface brings environmental indicators into a responsive dashboard, with emphasis on understandable trends, forecast exploration and actionable context. The project also explores atmospheric dispersion and planetary boundary layer concepts.

## Features documented in this project
- Air-quality and pollutant information views
- Weather and atmospheric context
- Forecast exploration and interactive visualizations
- Activity-oriented environmental guidance concepts
- Responsive dashboard interface

> Forecasts, confidence ranges and guidance are informational. They are not substitutes for official environmental alerts or medical advice. Actual availability of each feature should be checked in the code and running application.

## Stack
- React 19 and TypeScript
- Vite and Tailwind CSS
- Optional Google GenAI integration
- Environmental data sources described in the project documentation

## Local development
Requires a recent compatible Node.js and npm installation.

```bash
npm install
npm run dev
```

Build and type-check:
```bash
npm run build
npm run lint
```

Preview a production build:
```bash
npm run preview
```

Any API credentials must be configured locally using environment variables and must never be committed. Some external features may require additional setup.

## High-level flow
```text
Environmental data source(s)
          |
          v
Application data handling
          |
          v
React dashboard
          |
          +--> Current conditions
          +--> Forecast / trend views
          +--> User-facing guidance
```

## Skills demonstrated
- TypeScript and component-based UI development
- Building and organizing responsive dashboards
- Presenting environmental datasets and trends
- Integrating external data into a user interface

## Project scope
This repository documents a frontend application. Separate backend experiments should not be assumed to be included here unless present in the source tree. Scientific outputs and integration claims require independent validation.

**Author:** Arnav Sahu · B.Tech AI & ML, SIRT / RGPV
