# EnviroShield 🌍💨
### Planetary Boundary Layer & Real-Time Urban Air Quality Intelligence Platform

[![React 19](https://img.shields.io/badge/React-19.0.1-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4.3-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Meteorological Feeds](https://img.shields.io/badge/Data-Open--Meteo%20%7C%20ECMWF%20CAMS-0284C7)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 🌟 Overview

**EnviroShield** is an atmospheric intelligence platform engineered to replace opaque, black-box air quality dashboards with transparent, physics-based dispersion modeling and actionable health guidance.

Urban air pollution crises rarely occur solely because emissions spike—they become catastrophic when **meteorology traps the air**. When surface winds stagnate and a cold air layer sits above warm ground (a **thermal inversion layer**), it acts as a lid over a city basin, compressing particulate matter into the immediate human breathing zone.

EnviroShield couples **real-time atmospheric chemistry feeds** with **Eulerian boundary-layer physics** to forecast when the air is hazardous and pinpoint the exact **Cleanest Window of the Day** for safe outdoor ventilation and activities.

---

## 🚀 Key Features

### 1. Universal Standard AQI & Eulerian CGS Physics
- **Dual Unit Modes**: Seamlessly toggle between universal **EPA Air Quality Index (0–500)** with standard SI units ($\mu\text{g/m}^3$, $\text{km/h}$, $\text{hPa}$) and scientific **Eulerian CGS units** ($\text{g/cm}^3$, $\text{dyn/cm}^2$, $\text{cm/s}$) for academic and meteorological analysis.
- **Multi-Pollutant Telemetry**: Tracks PM2.5, PM10, Nitrogen Dioxide ($\text{NO}_2$), Tropospheric Ozone ($\text{O}_3$), Sulfur Dioxide ($\text{SO}_2$), and Carbon Monoxide ($\text{CO}$).

### 2. 48-Hour Numerical Forecast Engine
- **Interactive Scrubber**: An hour-by-hour timeline scrubber allowing users to inspect projected Planetary Boundary Layer (PBL) compression, particulate dispersion, and wind shifts.
- **Three Critical Milestones**: Instantly summarizes *Current Baseline (T+0)*, *Projected Smog Peak*, and *Projected Relief Horizon*.
- **Data Ledger & CSV Export**: Complete 48-timestep dataset with confidence intervals ($\text{CI}_{95\%}$) and 1-click RFC-4180 CSV export.

### 3. Cleanest Window of the Day
- Automatically detects the safest continuous 2-to-4 hour diurnal window for outdoor exercise, walking pets, and opening home ventilation before nocturnal inversion sets in.

### 4. Activity & Vulnerability Safety Matrix
- Real-time decision cards tailored for:
  - 🏃 **Outdoor Aerobic Running & Workouts**
  - 🚴 **Urban Commutes & Cycling**
  - 🫁 **High-Risk Sensitive Respiratory Groups (Asthma, Elderly, Children)**
  - 🏠 **Home & Office Ventilation (Window Management)**
  - 🐕 **Pet Walking & Low-Altitude Exposure**
  - 😷 **Protective Filtration & Respirator Recommendations**

### 5. Interactive Geospatial Cartographic Canvas
- Vector-rendered global cartography across 8 premier metropolitan nodes (Tokyo, London, New York, New Delhi, Paris, Cairo, São Paulo, Sydney).
- **Atmospheric Layer Overlays**:
  - PM2.5 Particulate Concentration Plumes
  - Animated Surface Wind Vectors
  - Planetary Boundary Layer Thermal Inversion Ceilings

### 6. Side-by-Side City Comparison
- Compare any two global cities simultaneously with synchronized local clocks, solar night/day indicators, boundary layer differences, and dispersion rate differentials.

### 7. Verifiable Atmospheric Box Physics
- Backed by conservation of mass in a turbulent atmospheric boundary layer:
$$\frac{dC}{dt} = \frac{Q}{H_{\text{pbl}}} - \frac{u \cdot C}{L} - k_{\text{chem}} C$$
- Compares live particulate densities against **WHO 2021 Global Air Quality Guidelines** (Annual $5\,\mu\text{g/m}^3$, 24-Hour $15\,\mu\text{g/m}^3$).
- Instant JSON serializable state export for automated research workflows.

### 8. Interactive Demo Scenarios
- One-click access to distinctive atmospheric archetypes:
  - 🇨🇭 **Pristine Alpine Air** (Zurich): High ventilation, deep planetary boundary layer ($1{,}450\,\text{m}$).
  - 🇮🇳 **Winter Inversion Crisis** (New Delhi): Boundary layer dropped to $<350\,\text{m}$, stagnant winds ($0.3\,\text{m/s}$).
  - 🇯🇵 **Maritime Megacity** (Tokyo): Pacific sea-breeze ventilation cycle clearing vehicle emissions.
  - 🇺🇸 **High-Altitude Valley Basin** (Denver): Low atmospheric pressure with ultraviolet photochemical ozone generation.

---

## 🎨 Design System & UI/UX

- **Frosted Glassmorphism**: Multi-layered backdrop blurs (`backdrop-blur-2xl`), ambient glow rings, and translucent glass surfaces.
- **Fluid Micro-Animations**: Smooth tab hover lift, interactive scale triggers, flag zoom animations, and staggered card entrances.
- **Responsive Layout**: Designed for seamless use across desktop widescreen monitors, tablets, and mobile devices.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Framework** | [React 19](https://react.dev/) + [TypeScript](https://www.typescriptlang.org/) |
| **Build Tool** | [Vite 8](https://vitejs.dev/) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) with native CSS Variables |
| **Icons & Typography** | [Google Material Symbols Outlined](https://fonts.google.com/icons) + [Inter](https://rsms.me/inter/) + [JetBrains Mono](https://www.jetbrains.com/lp/mono/) |
| **Meteorological APIs** | [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api) (Copernicus CAMS European Ensemble, NOAA GFS) |
| **Geocoding** | Open-Meteo Global Geocoding API with client-side debounce |

---

## ⚡ Getting Started

### Prerequisites
- **Node.js** (v18.0.0 or higher recommended)
- **npm** (v9.0.0 or higher)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/arnavsahufeb2007-spec/EnvirooShield.git
   cd EnvirooShield
   ```

2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   The application will be live at `http://localhost:3000/`.

4. **Build for production**:
   ```bash
   npm run build
   ```

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

---

## 📁 Repository Structure

```
EnvirooShield/
├── public/                     # Static assets
├── src/
│   ├── components/             # Reusable UI widgets & modals
│   │   ├── ui/                 # Atomic design tokens (Card, Badge, MetricCard, UnitToggle)
│   │   ├── ActivitySafetyMatrix.tsx
│   │   ├── CalibrationModal.tsx
│   │   ├── CityCompareModal.tsx
│   │   ├── CleanestWindowCard.tsx
│   │   ├── DemoScenariosModal.tsx
│   │   ├── ExportModal.tsx
│   │   ├── Footer.tsx
│   │   ├── GlobalSearchBar.tsx
│   │   ├── GuideModal.tsx
│   │   ├── Header.tsx
│   │   ├── HyperparametersModal.tsx
│   │   └── SoundingModal.tsx
│   ├── data/                   # Meteorological baseline mock sets
│   ├── screens/                # Core screen views
│   │   ├── OverviewIntelligenceScreen.tsx
│   │   ├── ForecastEngineScreen.tsx
│   │   ├── GeospatialGridScreen.tsx
│   │   └── ExplainableRiskScreen.tsx
│   ├── services/               # Open-Meteo API integrations & geocoding
│   ├── utils/                  # EPA AQI calculators, timezone engine, physical converters
│   ├── types.ts                # TypeScript interfaces & domain types
│   ├── App.tsx                 # Main application shell with atmospheric glow background
│   ├── index.css               # Design system tokens, glassmorphism utilities & keyframes
│   └── main.tsx                # React DOM entry point
├── package.json
├── vite.config.ts
└── README.md
```

---

## 📊 Scientific Provenance & Data Sources

- **Copernicus Atmosphere Monitoring Service (CAMS)**: European air quality reanalysis and 4-day forecast models.
- **NOAA Global Forecast System (GFS)**: Planetary boundary layer heights and surface wind fields.
- **World Health Organization (WHO 2021 Guidelines)**: Health risk benchmarks and exceedance factors.
- **US EPA AQI Standard (40 CFR Part 58, Appendix G)**: Standard piecewise linear breakpoint mapping.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
