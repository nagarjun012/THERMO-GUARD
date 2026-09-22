<div align="center">

# 🌡️ THERMO-GUARD (THERMOSAFE)
### AI-Powered Extreme Heat Early Warning & Biometeorological Telemetry System

[![React](https://img.shields.io/badge/React-18.3-blue.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![Open-Meteo](https://img.shields.io/badge/Weather-Open--Meteo%20Live-orange.svg?style=flat-square)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Protecting lives across India through deterministic thermal stress monitoring, predictive forecasting, and targeted interventions for vulnerable populations.**

[Live Demo](https://thermo-guard.vercel.app) • [Report Issue](https://github.com/nagarjun012/THERMO-GUARD/issues) • [Documentation](#documentation)

---

</div>

## 📌 Overview

**THERMO-GUARD** is a mission-critical biometeorological early warning platform designed to safeguard citizens, outdoor workers, elders, and municipal authorities from extreme heat events and dangerous heatwaves.

Covering all **788 districts across India's 36 States and Union Territories**, THERMO-GUARD replaces coarse ambient temperature measurements with **deterministic multi-factor biometeorological modeling** that accounts for humidity, solar irradiance, wind cooling, and human thermoregulation.

---

## ✨ Key Features

### 1. 📡 100% Genuine Real-Time Weather Telemetry
* Direct ingestion from **Open-Meteo High-Resolution Multi-Model API** (NOAA GFS Seamless).
* **Zero Mock / Synthetic Fallbacks**: Displays `DATA UNAVAILABLE` upon failure; never invents fake weather data.
* **9 Verified Real API Parameters**:
  * `temperature_2m` (Air Temperature in °C)
  * `relative_humidity_2m` (Relative Humidity in %)
  * `wind_speed_10m` (Wind Velocity in km/h)
  * `wind_direction_10m` (Wind Direction in Degrees)
  * `shortwave_radiation` (Solar Heat Load in W/m²)
  * `pressure_msl` (Mean Sea Level Pressure in hPa)
  * `dew_point_2m` (Dew Point Temperature in °C)
  * `apparent_temperature` (Physiological Equivalent Temp in °C)
  * `uv_index` (Solar Ultraviolet Radiation Index)

### 2. 🧮 Deterministic Biometeorological Engines
All thermal stress metrics are computed locally using authoritative scientific formulations:
* **Heat Index (HI)**: Authoritative NOAA / National Weather Service Rothfusz regression equation.
* **Outdoor Wet Bulb Globe Temperature (WBGT)**: Stull (2011) psychrometric wet bulb + Liljegren solar radiation and wind convection equations.
* **Universal Thermal Climate Index (UTCI)**: 6th-order biometeorological polynomial modeling physiological heat balance.
* **Heat Thermal Stress Score (HTSS)**: Composite index (0–100) combining ambient temperature, evaporative sweating limits, and radiative thermal load.

### 3. 🔐 Role-Based Dual Login Architecture
The platform provides two dedicated, isolated portals with strict tab visibility and route protection:

| Login Mode | Accessible Tabs | Hidden Tabs | Primary Target |
| :--- | :--- | :--- | :--- |
| **USER LOGIN** (Citizen / Field Worker) | **Dashboard**, **Live Map**, **Learn THERMOS**, **About** | ❌ **Gov Portal** | `/dashboard` |
| **GOV LOGIN** (Disaster Management / Officials) | **Gov Portal**, **Learn THERMOS**, **About** | ❌ **Dashboard & Live Map** | `/government` |

* **Server-Side Authenticated Sessions**: Cryptographically signed HMAC-SHA256 session tokens stored in `HttpOnly`, `SameSite` cookies. `localStorage` is never trusted for authorization.
* **Server-Enforced RBAC & Route Guards**: Serverless endpoints (`/api/htss`, `/api/admin/hospital/update`) and client router guards strictly verify role-based permissions (`CITIZEN`, `OFFICER`, `ADMIN`).

### 4. 🗺️ Interactive GIS & District-Level Heat Mapping
* Interactive Leaflet maps rendering microclimate zones and Urban Heat Islands (UHI).
* Dynamic hospital bed status and cooling shelter availability broadcast system.
* Real-time GPS location lock with reverse geocoding across Indian districts and taluks.

### 5. 🏛️ National Government Intelligence Command Center
* **All-India 788-District Rankings**: Real-time sorting by HTSS, WBGT, and air temperature.
* **State Filter & Risk Breakdowns**: Instant filtering across all 36 States & UTs.
* **Section 144 Triggers & Protocol Alerts**: Early warnings based on National Disaster Management Authority (NDMA) thresholds.

---

## 🛠️ Technology Stack

* **Frontend Framework**: React 18 + TypeScript
* **Build System**: Vite 5
* **Styling & Design System**: TailwindCSS 3 + Skeuomorphic Tactile Elements & Glassmorphism
* **Animations**: Framer Motion
* **Iconography**: Lucide React
* **State Management**: Zustand
* **Data Fetching & Cache**: TanStack React Query v5 + Axios
* **Mapping**: Leaflet + React-Leaflet
* **Visualizations**: Recharts
* **Serverless Backend**: Vercel Serverless Functions (`/api/weather`, `/api/htss`, `/api/refresh`)
* **Scheduled Cron**: Vercel Cron (Automated 3-hour nationwide weather synchronization)

---

## 📂 Repository Structure

```
THERMO-GUARD/
├── frontend/                     # Modern React + TypeScript Application
│   ├── api/                      # Vercel Serverless Functions
│   │   ├── htss.ts               # All-India telemetry endpoint
│   │   ├── refresh.ts            # Scheduled cron sync worker
│   │   └── weather.ts            # Single-location real-time weather & calculations
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/             # Dual LoginModal (User Login / Gov Login)
│   │   │   ├── dashboard/        # Instruments, dials, cards, gauges
│   │   │   ├── government/       # 788-district table, risk inspector, overview cards
│   │   │   ├── layout/           # Navbar, Header, district search bar
│   │   │   └── map/              # GIS Leaflet heat risk map & district telemetry layers
│   │   ├── data/                 # 788 districts, telemetry baselines, district coordinates
│   │   ├── hooks/                # React Query hooks for real-time telemetry
│   │   ├── pages/                # CitizenDashboard, GovDashboard, Map, Learn, About, Landing
│   │   ├── services/             # API services, GPS location, district telemetry
│   │   ├── stores/               # Zustand appStore (location, userRole, auth)
│   │   ├── types/                # TypeScript interfaces & biometeorological types
│   │   └── utils/                # Thermal calculation engine (Rothfusz, Stull, Liljegren)
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vercel.json               # Subdirectory Vercel deployment config
│   └── vite.config.ts            # Vite build configuration with local API proxy
├── backend/                      # Optional standalone Python FastAPI backend
├── package.json                  # Root monorepo build script
├── vercel.json                   # Root turn-key Vercel deployment configuration
├── start.bat                     # Windows 1-click local development launcher
└── README.md                     # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/nagarjun012/THERMO-GUARD.git
   cd THERMO-GUARD
   ```

2. **Install frontend dependencies**:
   ```bash
   cd frontend
   npm install
   ```

3. **Start the local development server**:
   ```bash
   npm run dev
   ```
   *The application will launch on `http://localhost:5173`.*

4. **1-Click Launch (Windows)**:
   You can also double-click [`start.bat`](start.bat) from the root directory to start the server and open the browser automatically.

---

## 🧪 Build & Validation

To compile TypeScript and validate the production bundle:

```bash
# From repository root:
npm run build

# Or from frontend directory:
cd frontend
npm run build
```

---


## 📜 Scientific References & Standards

1. **Rothfusz, L. P. (1990)**: *The Computation and Use of the National Weather Service Heat Index*. NOAA Technical Attachment, SR/SSD 90-23.
2. **Stull, R. (2011)**: *Wet-Bulb Temperature from Relative Humidity and Air Temperature*. Journal of Applied Meteorology and Climatology, 50(11), 2267–2269.
3. **Liljegren, J. C., et al. (2008)**: *Modeling the Wet Bulb Globe Temperature Using Standard Meteorological Measurements*. Journal of Occupational and Environmental Hygiene, 5(10), 645–655.
4. **Jendritzky, G., et al. (2012)**: *UTCI—Why another thermal index?* International Journal of Biometeorology, 56(3), 421–428.
5. **NDMA India**: *National Guidelines for Preparation of Action Plan - Prevention and Management of Heat Wave*. National Disaster Management Authority, Government of India.

---
