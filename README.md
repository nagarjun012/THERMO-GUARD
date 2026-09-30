<div align="center">

# 🌡️ THERMO-GUARD (THERMOSAFE)
### AI-Driven Extreme Heat Early Warning, Biometeorological Telemetry & Heat Disaster Mitigation Platform

[![Tests](https://img.shields.io/badge/Tests-29%2F29%20Passing-brightgreen.svg?style=flat-square)](frontend/tests/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5%20Strict-blue.svg?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg?style=flat-square&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF.svg?style=flat-square&logo=vite)](https://vitejs.dev/)
[![NDMA Compliant](https://img.shields.io/badge/NDMA%20HAP-Compliant-orange.svg?style=flat-square)](https://ndma.gov.in/)
[![Open-Meteo](https://img.shields.io/badge/Weather-Open--Meteo%20Live-yellow.svg?style=flat-square)](https://open-meteo.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-lightgrey.svg?style=flat-square)](https://opensource.org/licenses/MIT)

**Protecting lives across India through deterministic biometeorological stress monitoring, explainable machine learning predictions, and rapid civil action.**

[📖 Complete Walkthrough PDF](THERMO_GUARD_COMPLETE_WALKTHROUGH.pdf) • [Live Demo](https://thermo-guard.vercel.app) • [Report Issue](https://github.com/nagarjun012/THERMO-GUARD/issues) • [NDMA Guidelines](https://ndma.gov.in)

---

</div>

## 📌 Executive Overview

**THERMO-GUARD** is a mission-critical biometeorological early warning and disaster mitigation platform engineered to protect citizens, outdoor laborers, elderly populations, and disaster authorities from fatal heat stress.

Covering all **700+ districts across India's 28 States and 8 Union Territories**, THERMO-GUARD moves beyond single-parameter air thermometer readings by calculating **deterministic multi-factor biometeorological strain** (relative humidity, solar radiation, wind velocity, and human thermoregulation) and coupling it with **Explainable AI (XAI)** and **automated NDMA Heat Action Plan (HAP) incident reporting**.

---

## 🏛️ Dual-Portal Operational Architecture

The platform operates as a secure, role-based dual-portal ecosystem:

```
┌────────────────────────────────────────────────────────────────────────┐
│                              THERMO GUARD                              │
│                    Role-Based Security & Routing                       │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │                                │
                    ▼                                ▼
┌──────────────────────────────────────┐┌──────────────────────────────────────┐
│     CITIZEN EARLY WARNING PORTAL     ││  DISASTER COMMAND & GOV PORTAL       │
│               (/dashboard)           ││             (/government)            │
├──────────────────────────────────────┤├──────────────────────────────────────┤
│ • Real-Time Thermal Stress Gauge     ││ • 700+ District Real-Time Matrix     │
│ • NIOSH/OSHA Work-Rest Planner       ││ • 1-Click NDMA SITREP PDF Exporter   │
│ • Personalized Vulnerability Profiles││ • Resource & Cooling Shelter Dispatch│
│ • Emergency Heat Alert & SOS Modal   ││ • Model Benchmark & Integrity Audit  │
└──────────────────────────────────────┘└──────────────────────────────────────┘
```

| Portal | Target Users | Accessible Features | Primary Route |
| :--- | :--- | :--- | :--- |
| **Citizen Portal** | Citizens, Outdoor Laborers, Gig Workers, Elders | Live Stress Gauge, Work-Rest Scheduler, Hourly Forecast, SOS Modal, Learn Hub | `/dashboard` |
| **Government Portal** | NDMA, SDMA, District Collectors (DDMA), Health Officers | 700+ District Severity Matrix, 1-Click SITREP PDF Generator, Resource Dispatch, Audit Inspector | `/government` |

---

## ✨ Core Innovations & Key Features

### 1. 📡 Live High-Resolution Telemetry
* Direct ingestion from **Open-Meteo High-Resolution Multi-Model API** and IMD observation frameworks.
* **Zero Mock Fallbacks**: Guaranteed genuine data; explicit fallback indicators upon network disruption.
* **9 Tracked Telemetry Dimensions**: 2m Air Temperature, Relative Humidity, Dew Point, Mean Sea Level Pressure, Surface Wind Speed & Direction, Shortwave Solar Radiation, Apparent Temperature, and UV Index.

### 2. 🧮 Authoritative Biometeorological Modeling
* **Wet Bulb Globe Temperature (WBGT - ISO 7243)**: Outdoor formulation utilizing Stull (2011) iterative psychrometry for wet-bulb temperature, combined with solar and convective heat flux modeling.
* **Canadian Humidex Scale**: Quantifies subjective discomfort and evaporative sweat impairment from actual atmospheric vapour pressure.
* **NOAA Heat Index**: Rothfusz 9-parameter polynomial regression with boundary condition adjustments for extreme humidity.
* **Heat Thermal Stress Score (HTSS 0–100)**: Proprietary multi-factor composite index incorporating normalized environmental strain and district vulnerability weights.

### 3. 🤖 Explainable AI (XAI) & Heat-Health Risk Prediction
* **Ensemble Predictive Regressors**: 7-day predictive health risk modeling based on diurnal temperature range, minimum nocturnal temperature (tropical night trapping), and 3-day thermal accumulation.
* **Transparent Risk Factor Attribution**: Replaces black-box opacity with clear, verifiable percentage contribution breakdowns:
  * *Ambient Heat Load (~35–45%)*
  * *Relative Humidity (~25–35%)*
  * *Nocturnal Trapping Effect (~15–20%)*
  * *Solar UV Radiation (~8–12%)*
* **Open Benchmark Transparency**: Embedded audit modal exposing cross-validated model precision, RMSE, and error bounds.

### 4. 📄 1-Click Automated NDMA SITREP PDF Exporter
* Generates official, print-ready, high-contrast vector PDF **Daily Situation Reports (SITREPs)** compliant with National Disaster Management Authority (NDMA) Heat Action Plan guidelines.
* Includes national command headers, reporting officer credentials, executive threat distribution cards, priority district matrices, and standardized statutory civil directives.

### 5. 📱 Universal Responsive & Sunlight-Readable Design
* **320px–390px Mobile Viewport Optimization**: Sticky table headers, horizontal touch-swipe banners, full location titles without truncation, and flexible action buttons.
* **High-Contrast Light Theme**: Slate typography against soft blue and pure white cards (`#DBEAFE` / `#0F172A`), ensuring clarity under direct outdoor sunlight for field operators.
* **Hardware-Accelerated Tactile UI**: Micro-motion gauges, interactive dials, and responsive radar charts.

---

## 🧪 Automated Testing & Verification Suite

THERMO-GUARD enforces rigorous quality assurance with a **100% pass rate** across all automated test suites:

```bash
npm test
```

```
================================================================================
Test Suite                                  Tests   Status
--------------------------------------------------------------------------------
1. Security, CSRF & HMAC Session RBAC       9/9     PASSED
2. Heat-Health Risk Regressors & Boundaries 8/8     PASSED
3. HTSS Alert Engine & Threshold Logic      8/8     PASSED
4. NDMA Daily SITREP PDF Exporter           4/4     PASSED
--------------------------------------------------------------------------------
TOTAL AUTOMATED TEST VERIFICATION           29/29   100% PASSED (0 FAILED)
================================================================================
```

* **TypeScript Strict Compilation**: Zero errors across frontend module builds (`tsc -b`) and serverless Node builds (`tsc --noEmit`).

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend Framework** | React 18.3, TypeScript 5.5, Vite 5.4 |
| **Styling & System** | Tailwind CSS 3.4, Vanilla CSS Design System |
| **Animations & Icons** | Framer Motion 11, Lucide React |
| **Data Fetching & Cache**| TanStack React Query v5, Axios |
| **Mapping & GIS** | Leaflet 1.9, React-Leaflet |
| **Visualizations** | Recharts 2.15 |
| **Document Generation** | jsPDF 4.2, jsPDF-AutoTable 5.0 |
| **Serverless Backend** | Vercel Node Functions (`/api/weather`, `/api/htss`, `/api/health-risk`, `/api/auth`) |
| **Mobile Architecture** | Capacitor 8 (Cross-Platform Android & iOS builds) |

---

## 📂 Repository Structure

```
THERMO-GUARD/
├── THERMO_GUARD_COMPLETE_WALKTHROUGH.pdf # Official 5-page walkthrough PDF
├── frontend/                             # Modern React + TypeScript Application
│   ├── api/                              # Vercel Serverless API Functions
│   │   ├── auth.ts                       # HMAC-SHA256 session issuance & verification
│   │   ├── health-risk.ts                # Ensemble predictive health risk endpoint
│   │   ├── htss.ts                       # Pan-India telemetry aggregation endpoint
│   │   ├── refresh.ts                    # Scheduled weather sync worker
│   │   └── weather.ts                    # Single-location real-time weather engine
│   ├── public/
│   │   └── THERMO_GUARD_COMPLETE_WALKTHROUGH.pdf # Downloadable web copy
│   ├── scripts/
│   │   └── generate_walkthrough_pdf.mjs  # Standalone vector PDF generation script
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/                     # Dual LoginModal (User Login / Gov Login)
│   │   │   ├── common/                   # EmergencyHeatAlertModal, Nav, Toasts
│   │   │   ├── dashboard/                # Dials, stress gauges, work-rest schedulers
│   │   │   ├── government/               # 700+ district matrix, SITREP trigger, audit
│   │   │   ├── layout/                   # Header, Navbar, location search bar
│   │   │   └── map/                      # GIS Leaflet heat risk map & layers
│   │   ├── data/                         # 700+ Indian districts & population baselines
│   │   ├── hooks/                        # React Query telemetry & alert hooks
│   │   ├── pages/                        # CitizenDashboard, GovDashboard, Learn, Map
│   │   ├── utils/                        # Biometeorological & SITREP PDF generators
│   │   └── index.css                     # Tactile design tokens & responsive utilities
│   ├── tests/                            # Automated test suites (29 tests)
│   ├── package.json                      # Frontend dependencies & test scripts
│   └── vite.config.ts                    # Vite build configuration
├── backend/                              # Standalone Python FastAPI backend service
├── start.bat                             # Windows 1-click launcher
└── README.md                             # Project documentation
```

---

## 🚀 Getting Started

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Installation & Launch

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

3. **Run automated verification tests**:
   ```bash
   npm test
   ```

4. **Start the local development server**:
   ```bash
   npm run dev
   ```
   *The application will launch on `http://localhost:5173`.*

5. **1-Click Launch (Windows)**:
   Double-click [`start.bat`](start.bat) from the root directory to automatically launch the dev server and browser.

---

## 📜 Scientific References & Standards

1. **Rothfusz, L. P. (1990)**: *The Computation and Use of the National Weather Service Heat Index*. NOAA Technical Attachment, SR/SSD 90-23.
2. **Stull, R. (2011)**: *Wet-Bulb Temperature from Relative Humidity and Air Temperature*. Journal of Applied Meteorology and Climatology, 50(11), 2267–2269.
3. **Liljegren, J. C., et al. (2008)**: *Modeling the Wet Bulb Globe Temperature Using Standard Meteorological Measurements*. Journal of Occupational and Environmental Hygiene, 5(10), 645–655.
4. **Masterton, J. M., & Richardson, F. A. (1979)**: *Humidex: A method of quantifying human discomfort due to excessive heat and humidity*. Environment Canada.
5. **NDMA India (2019/2024)**: *National Guidelines for Preparation of Action Plan - Prevention and Management of Heat Wave*. National Disaster Management Authority, Government of India.
6. **ISO 7243 (2017)**: *Ergonomics of the thermal environment — Assessment of heat stress using the WBGT (wet bulb globe temperature) index*. International Organization for Standardization.

---

## 📄 Documentation & Resources

* 📄 **[Download Complete Walkthrough PDF](THERMO_GUARD_COMPLETE_WALKTHROUGH.pdf)**: Comprehensive 5-page guide covering mathematical foundations, architectural diagrams, component walkthroughs, and NDMA operational checklists.
* 🌐 **[Live Application](https://thermo-guard.vercel.app)**
* ⚖️ **License**: Open-source under the [MIT License](LICENSE).
