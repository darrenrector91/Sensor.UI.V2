# Sensor.UI

Angular dashboard for a Raspberry Pi-hosted ESP32 sensor platform.

This application displays environmental sensor data from a generalized **Controller → Sensor → Measurement** backend model. The current working sensor is an ESP32 with an SHT35 temperature/humidity sensor, but the UI is designed to support additional sensor types over time.

## Project Purpose

Sensor.UI is the frontend dashboard for viewing measurements collected from ESP32-based sensor controllers and stored by a Raspberry Pi-hosted .NET API.

The UI is intentionally measurement-driven instead of sensor-specific. Temperature, humidity, soil moisture, light, battery voltage, pump state, water level, signal strength, and other future readings can all be represented as generalized measurements.

## Current Architecture

Controller
└── Sensor
    └── Measurement

The backend returns flat measurement rows. The Angular UI groups those rows into controllers and sensors, then displays the latest measurements on compact dashboard cards.

## Current Backend

The dashboard currently connects to:

http://192.168.5.103:5278/api/dashboard/measurements

The API is hosted on a Raspberry Pi and backed by a .NET API with PostgreSQL.

## Current Features

- Angular standalone application
- Controller dashboard
- Compact controller cards
- Dynamic measurement icon mapping
- Generalized measurement display configuration
- Celsius and Fahrenheit temperature display
- Generic scoped dashboard routes
- Controller, location, and sensor scoped views
- Loading, empty, and error states
- Bootstrap grid layout
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

## Measurement Display

Measurement display is driven by configuration instead of hardcoded sensor types.

Examples:

Temperature       thermostat icon       °C and °F display
Humidity          humidity icon          percentage display
SoilMoisture      water drop icon        gauge-ready display
BatteryVoltage    battery icon           voltage display
SignalStrength    Wi-Fi icon             signal display

Unknown measurement types fall back to a generic display configuration.

## Development

Install dependencies:

npm install

Run locally:

ng serve --host 0.0.0.0 --port 4200

Build:

ng build

Run tests:

ng test --watch=false

## Notes

This project is intentionally being rebuilt cleanly as a modern Angular standalone application.

Avoid bringing in old Angular module-based files, legacy SensorReadings models, or earlier experimental UI branches. The preferred direction is the generalized measurement model.

## Planned Work

- Improve scoped dashboard styling
- Add richer measurement-specific detail views
- Add historical charts for sensor measurements
- Add additional display kinds such as gauge, status, timeline, and value card
- Add future backend endpoints for scoped/history data if needed
- Continue supporting new measurement types without redesigning the core UI
