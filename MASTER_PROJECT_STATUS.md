# Sensor.UI - MASTER PROJECT STATUS

Last Updated: 2026-05-27

---

# Project Purpose

Sensor.UI is the Angular frontend for the generalized IoT sensor platform.

The application consumes the Sensor.Api backend and renders:

- controller dashboards
- scoped dashboards
- live measurement cards
- historical measurement charts
- grouped sensor views
- location-aware dashboards

The frontend is already operating far beyond prototype stage and has an established architecture that should be extended rather than replaced.

---

# Current Frontend Stack

Frontend framework:

- Angular standalone architecture

Language:

- TypeScript

Styling:

- SCSS

Charting:

- Chart.js

Architecture style:

- reusable component composition
- scoped dashboard architecture
- shared rendering services
- grouped measurement rendering

Angular conventions:

- separate .ts / .html / .scss files
- TypeScript model classes preferred over interfaces
- no inline templates unless explicitly required
- generated tests should remain
- validation command:
  - ng test --watch=false

---

# Current Backend Integration

Primary API:

- http://192.168.5.103:5278

Swagger:

- http://localhost:5278/swagger

Current backend endpoints actively integrated or intended for integration:

- GET /api/dashboard/measurements
- GET /api/sensors/{sensorId}/measurements
- GET /api/sensors/{sensorId}/measurements/latest
- GET /api/measurement-types
- GET /api/controllers
- GET /api/controllers/{controllerId}/sensors
- GET /api/locations

Current dashboard functionality already uses:

- grouped dashboard measurements
- range-aware history queries
- live API rendering

---

# Current Frontend Architecture

## Pages

Current page architecture:

- controller-dashboard
- scoped-dashboard

Current scoped dashboard routing:

- /dashboard/controller/:id
- /dashboard/location/:location
- /dashboard/sensor/:id

Main dashboard route:

- /

---

## Components

Current reusable components:

- controller-card
- measurement-line-chart
- scoped-dashboard-header
- scoped-health-summary
- scoped-latest-measurements
- scoped-measurement-panel
- scoped-time-range-selector

These components already establish the frontend rendering system and should NOT be rebuilt or duplicated.

---

## Shared Infrastructure

Existing shared systems:

- shared/dialogs/device-create-dialog
- grouped dashboard rendering
- reusable chart rendering
- reusable measurement rendering
- centralized measurement display abstraction

---

# Existing Frontend Services

Current services already implemented:

- dashboard-measurements.service.ts
- measurement-display-config.service.ts
- measurement-display-value.service.ts

These services form the existing frontend rendering pipeline and should be extended rather than replaced.

---

# Existing Frontend Models

Current frontend model classes:

- controller-card-metric
- dashboard-controller
- dashboard-measurement
- dashboard-sensor
- measurement-display-config
- measurement-display-value
- scoped-health-status
- scoped-measurement-group
- scoped-measurement-statistics
- scoped-sensor-group
- sensor-measurement-history

The frontend already uses model classes consistently and should continue doing so.

---

# Existing Frontend Enums

Current enums:

- dashboard-scope
- measurement-display-kind

---

# Current Dashboard Features

## Dashboard Rendering

Currently working:

- live controller dashboard
- grouped measurement rendering
- scoped dashboard views
- controller grouping
- sensor grouping
- location-aware rendering
- latest measurement rendering
- timestamp rendering
- temperature conversion rendering

---

## Charting

Currently working:

- Chart.js line charts
- range-aware charts
- selectable time ranges
- 6H / 24H / 7D / 30D ranges
- query-string persisted ranges

---

## Measurement Display System

Current architecture already includes:

- measurement display abstraction
- measurement display config service
- measurement display formatting service
- measurement display kind enum
- centralized measurement rendering pipeline

This architecture already exists and should be extended rather than recreated.

---

# Current Backend Architecture Assumptions

Frontend is built around the following backend model:

Controller
-> Sensor
-> Measurement

Measurements are generalized rows:

- measurementType
- value
- unit
- createdUtc

Frontend should NOT assume:

- hardcoded temperature/humidity schema tables
- fixed sensor types
- fixed measurement types

---

# Current MeasurementTypes Direction

MeasurementTypes is now intended to become the frontend display source of truth.

The backend already exposes:

- GET /api/measurement-types
- POST /api/measurement-types

Frontend currently still contains partially hardcoded measurement display configuration.

The current milestone is to evolve the existing frontend rendering system so:

- display metadata comes from the backend
- existing UI appearance remains unchanged
- fallback behavior remains intact

This is a source-of-truth migration, NOT a dashboard redesign.

---

# Current Active Frontend Milestone

Current milestone:

- integrate backend MeasurementTypes metadata into the existing frontend display pipeline

Goal:

- preserve existing UI
- preserve current dashboard appearance
- preserve fallback behavior
- eliminate hardcoded display metadata

Current target service:

- measurement-display-config.service.ts

Expected supporting service:

- measurement-types.service.ts

---

# Existing Systems - DO NOT DUPLICATE

The following systems already exist and should NOT be recreated:

- scoped dashboard architecture
- measurement rendering pipeline
- chart rendering system
- grouped dashboard rendering
- range-aware history integration
- shared dialog infrastructure
- dashboard routing system
- measurement display abstraction
- grouped statistics models
- reusable chart components
- reusable dashboard components

Before creating anything new:

1. Verify it does not already exist
2. Verify there is not already an abstraction layer
3. Extend the existing architecture first

---

# Known Current Frontend Gaps

Still needed:

- backend-driven measurement display config loading
- Add Measurement Type workflow
- Sensor Setup / Provisioning workflow
- create workflows wired into existing dialog system
- frontend integration for controller/sensor/location creation

These should extend existing systems rather than introducing parallel structures.

---

# Deferred Work

Explicitly deferred:

- auth
- NgRx/state rewrite
- MQTT frontend integration
- admin tooling
- advanced filtering
- pagination
- analytics dashboards
- deployment automation
- major refactors
- architecture rewrites
- frontend framework restructuring

Do NOT prioritize cleanup or refactors over completing current workflows.

---

# Current Branch Strategy

Frontend work should continue using focused feature branches.

Examples:

- feature/angular-measurement-type-config
- feature/sensor-provisioning
- feature/device-create-workflow

Keep branches:

- small
- focused
- mergeable
- milestone-oriented

---

# Frontend Validation Workflow

Validation command:

```bash
ng test --watch=false
```

Run frontend locally:

```bash
ng serve
```

Frontend local URL:

- http://localhost:4200

---

# Important Project Guidance

This frontend is no longer an early prototype.

The core architecture already exists.

Future work should focus on:

- extending existing systems
- completing workflows
- evolving data sources
- refining UX
- integrating backend metadata

Avoid:

- duplicate architecture
- unnecessary scaffolding
- rebuilding existing systems
- speculative abstractions
- large-scale rewrites
