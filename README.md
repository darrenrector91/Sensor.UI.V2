# Sensor.UI

Angular dashboard for a Raspberry Pi-hosted ESP32 environmental sensor platform.

This application displays environmental sensor data from a generalized **Controller → Sensor → Measurement** backend model. The current working sensor is an ESP32 with an SHT35 temperature/humidity sensor, but the UI is designed to support additional sensor types over time.

## Project Purpose

Sensor.UI is the frontend dashboard for viewing measurements collected from ESP32-based sensor controllers and stored by a Raspberry Pi-hosted .NET API.

The UI is intentionally measurement-driven instead of sensor-specific. Temperature, humidity, soil moisture, light, battery voltage, pump state, water level, signal strength, and future readings can all be represented as generalized measurements.

## Current Architecture

Controller
└── Sensor
    └── Measurement

The backend returns measurement rows. The Angular UI groups those rows into controllers, sensors, latest values, health summaries, and chart-ready measurement panels.

## Backend

The dashboard API base URL is configured through Angular environment files:

src/environments/environment.ts
src/environments/environment.development.ts

Current API base URL:

http://192.168.5.103:5278

Primary endpoints currently used:

/api/dashboard/measurements
/api/sensors/:sensorId/measurements

The dashboard endpoint provides enriched controller/sensor metadata. The sensor history endpoint provides lean historical measurement rows, which the UI maps back into enriched dashboard measurements for chart display.

## Current Features

- Angular 20 standalone application
- Generalized Controller → Sensor → Measurement model
- Controller dashboard
- Compact controller summary cards
- Clickable controller, location, and sensor navigation
- Generic scoped dashboard for controller, location, and sensor views
- Dynamic measurement display configuration
- Dynamic labels, icons, priorities, display kinds, and accent colors
- Celsius display with Fahrenheit companion values
- Chart.js line charts for historical measurements
- Time range selector for scoped dashboards
- Supported scoped time ranges: 6H, 24H, 7D, 30D
- URL-persisted selected time range
- Scoped latest measurement summary cards
- Scoped health summary with recent/stale/no-data status
- Chart empty state when there are not enough readings for a trend
- Chart point limiting for large history sets
- Environment-based API base URL
- Bootstrap grid support
- Angular Material support

## Current Dashboard Routes

- `/`  
  Main controller dashboard

- `/dashboard/controller/:id`  
  Controller scoped dashboard

- `/dashboard/location/:location`  
  Location scoped dashboard

- `/dashboard/sensor/:id`  
  Sensor scoped dashboard

Examples:

- `/dashboard/controller/1`
- `/dashboard/location/Garden`
- `/dashboard/sensor/1`
- `/dashboard/sensor/1?range=7D`

## Scoped Dashboard Structure

The scoped dashboard is built from focused child components:

src/app/components/scoped-dashboard-header
src/app/components/scoped-latest-measurements
src/app/components/scoped-health-summary
src/app/components/scoped-measurement-panel
src/app/components/scoped-time-range-selector
src/app/components/measurement-line-chart

The page component handles route scope, loading, filtering, grouping, and orchestration. Child components handle presentation.

## Measurement Display

Measurement display is driven by configuration instead of hardcoded sensor types.

Examples:

Temperature       thermostat icon       line chart       °C and °F display
Humidity          humidity icon          line chart       percentage display
SoilMoisture      water drop icon        gauge-ready      percentage display
BatteryVoltage    battery icon           value/status     voltage display
SignalStrength    signal icon            value/status     dBm display

Unknown measurement types fall back to a generic display configuration.

## Development

Install dependencies:

npm install

Run locally:

ng serve --host 0.0.0.0 --port 4200

Run tests:

ng test --watch=false

## Notes

This project is intentionally being rebuilt cleanly as a modern Angular application.

Avoid bringing in old Angular module-based files, legacy SensorReadings models, or earlier experimental UI branches. The preferred direction is the generalized measurement model.

## Planned Work

- Continue visual QA on scoped dashboards
- Improve chart tooltip and axis formatting for additional units
- Replace placeholder gauge/status/timeline displays with real components
- Add richer measurement-specific detail views
- Add backend query parameters or scoped history endpoints if client-side filtering becomes too heavy
- Continue supporting new measurement types without redesigning the core UI
