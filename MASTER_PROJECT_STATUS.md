# Sensor.Api - MASTER PROJECT STATUS

Last Updated: 2026-05-27

---

# Project Purpose

Sensor.Api is the backend platform for the generalized IoT sensor system.

The API receives sensor measurements from ESP32 devices, stores them in PostgreSQL, and serves controller, sensor, location, measurement, and dashboard data to the Angular frontend.

The platform has evolved from a hardcoded temperature/humidity design into a generalized:

Controller
-> Sensor
-> Measurement

architecture.

The backend is already operating with production-style layering and should be extended rather than redesigned.

---

# Current Backend Stack

Framework:

- .NET 8 ASP.NET Core Web API

Database:

- PostgreSQL

Data access:

- Dapper
- Npgsql

API documentation:

- Swagger

Hosting:

- Raspberry Pi

Solution projects:

- Sensor.Api.Web
- Sensor.Api.Data
- Sensor.Api.Core

---

# Current Backend Architecture

Current layered architecture:

Controller
-> IService
-> Service
-> IRepository
-> Repository

Responsibilities:

Controller:

- HTTP routing
- model binding
- response codes
- thin request handling

Service:

- business logic
- validation
- orchestration
- normalization
- response shaping

Repository:

- SQL
- Dapper mapping
- database access only

Repositories should NOT contain business rules.

Controllers should inject services only.

---

# Current Database

Database:

- sensor_data

User:

- sensor_api

Primary active tables:

- Controllers
- Sensors
- SensorMeasurements
- MeasurementTypes
- Locations

Legacy / deferred cleanup:

- SensorReadings
- SensorReadingsV2

---

# Current Platform Direction

Preferred architecture:

Controller
-> Sensor
-> Measurement

Measurements are generalized rows:

- MeasurementType
- Value
- Unit
- CreatedUtc

The system intentionally supports:

- Temperature
- Humidity
- Soil moisture
- Light
- Battery voltage
- Water level
- Pump state
- Door state
- Future measurement types

without schema redesign.

---

# Current Measurement Model

Current SensorMeasurements schema:

- Id
- SensorId
- MeasurementType
- Value
- Unit
- CreatedUtc

Important architecture rule:

- Value intentionally remains a string
- Numeric parsing belongs only in chart/statistics-specific logic

---

# Current MeasurementTypes Direction

MeasurementTypes is now the intended source of truth for frontend display metadata.

MeasurementTypes fields:

- Name
- DisplayName
- DefaultUnit
- Icon
- DisplayKind
- Priority
- CssClass
- AccentColor
- Description

MeasurementTypes should drive:

- icons
- colors
- display styles
- chart grouping
- priority
- css styling

Angular should eventually stop hardcoding:

- temperature display config
- humidity display config

---

# Current Backend Features

## Controllers

Implemented:

- GET /api/controllers
- GET /api/controllers/{id}
- POST /api/controllers
- PUT /api/controllers/{id}

---

## Sensors

Implemented:

- GET /api/controllers/{controllerId}/sensors
- GET /api/sensors/{id}
- POST /api/sensors
- PUT /api/sensors/{id}

---

## Measurements

Implemented:

- POST /api/sensors/{sensorId}/measurements
- GET /api/sensors/{sensorId}/measurements
- GET /api/sensors/{sensorId}/measurements/latest
- GET /api/dashboard/measurements

History endpoint supports:

- fromUtc
- toUtc
- limit

Range-aware history querying is already implemented.

---

## MeasurementTypes

Implemented:

- GET /api/measurement-types
- POST /api/measurement-types

MeasurementTypes table already exists and is seeded.

---

## Locations

Implemented:

- GET /api/locations
- GET /api/locations/{id}
- POST /api/locations
- PUT /api/locations/{id}
- DELETE /api/locations/{id}

Locations are relational and already integrated into:

- Controllers
- Sensors
- Dashboard queries

---

## Status

Implemented:

- GET /api/status
- GET /api/status/database

---

# Relational Location System

Controllers:

- LocationId
- resolved Location name

Sensors:

- LocationId
- resolved Location name

Dashboard measurements:

- resolve location through LEFT JOIN

Important PostgreSQL rule:
quoted identifiers are required.

Examples:

- "Locations"
- "LocationId"
- "Name"

---

# Current Repository State

Current repositories:

- ControllerRepository
- SensorRepository
- SensorMeasurementRepository
- DashboardRepository
- MeasurementTypeRepository
- LocationRepository

Repository interfaces exist and are wired through services.

---

# Current QueryResults State

The project intentionally uses:

- QueryResults

folder naming.

DO NOT:

- rename QueryResults
- replace QueryResults
- introduce QueryRequests folder

Known technical debt:
request DTOs currently live inside QueryResults naming.

Examples:

- CreateControllerQR
- UpdateControllerQR
- CreateSensorQR
- UpdateSensorQR

This cleanup is deferred and NOT a current priority.

---

# Current Raspberry Pi Deployment

Pi host:

- 192.168.5.103

Swagger:

- http://192.168.5.103:5278/swagger

Angular dashboard:

- http://192.168.5.103/

Backend service:

- sensor-api

Deployment paths:

- /home/drector/projects/Sensor.Api
- /home/drector/apps/sensor-api

Runtime:

- /home/drector/.dotnet/dotnet

---

# Raspberry Pi Deployment Workflow

## Frontend Deployment

Angular is built locally on the Mac and deployed to the Raspberry Pi through Nginx.

Build frontend:

```bash
ng test --watch=false
npm run build
```

Build output:

```text
/Users/darrenrector/Documents/Projects/SensorDashboard/Sensor.UI/dist/Sensor.UI/browser
```

Copy to Pi staging area:

```bash
rsync -av --delete /Users/darrenrector/Documents/Projects/SensorDashboard/Sensor.UI/dist/Sensor.UI/browser/ drector@192.168.5.103:/tmp/sensor-ui/
```

Deploy on Pi:

```bash
sudo rsync -av --delete /tmp/sensor-ui/ /var/www/sensor-dashboard/
sudo chown -R www-data:www-data /var/www/sensor-dashboard
sudo nginx -t
sudo systemctl reload nginx
```

Frontend web root:

- /var/www/sensor-dashboard

---

## Backend Deployment

Copy source from Mac:

```bash
rsync -av --delete --exclude ".git" --exclude "bin" --exclude "obj" /Users/darrenrector/Documents/Projects/SensorDashboard/Sensor.Api/ drector@192.168.5.103:/home/drector/projects/Sensor.Api/
```

Verify copy:

```bash
find /home/drector/projects/Sensor.Api -type f -mmin -10 | sort
```

Build:

```bash
cd ~/projects/Sensor.Api
dotnet build ./Sensor.Api.Web/Sensor.Api.Web.csproj
```

Important:

- Sensor.Api.slnx exists instead of a traditional .sln.
- Use the explicit project build command above.

Publish:

```bash
dotnet publish ./Sensor.Api.Web/Sensor.Api.Web.csproj -c Release -o /home/drector/apps/sensor-api
```

Restart:

```bash
sudo systemctl restart sensor-api
sudo systemctl status sensor-api --no-pager
```

---

## Deployment Verification

Swagger:

- http://192.168.5.103:5278/swagger

Dashboard:

- http://192.168.5.103/

Verify new endpoints appear in Swagger before testing from Angular.

---

## Deployment Lesson Learned

Location Create troubleshooting confirmed that a frontend deployment can succeed while new functionality still fails if the backend deployment was skipped.

When adding new API endpoints:

1. Deploy frontend.
2. Deploy backend.
3. Restart sensor-api.
4. Verify endpoint appears in Swagger.
5. Test from Angular.

A 404 on a newly-added endpoint should trigger deployment verification before frontend debugging.

---

# Current ESP32 Integration

ESP32 currently:

- reads SHT35
- posts Temperature
- posts Humidity

Current payload shape:

```json
{
  "measurementType": "Temperature",
  "value": "22.6",
  "unit": "C"
}
```

Current firmware behavior:

- hardcoded sensorId = 1
- hourly posting interval

The generalized backend pipeline is already functioning.

---

# Current Frontend Integration Expectations

Frontend already consumes:

- dashboard measurements
- range-aware history
- grouped controller/sensor data

Frontend direction:

- load MeasurementTypes from backend
- eliminate hardcoded frontend display config

The backend APIs already support this direction.

---

# Current Angular Admin Status

Completed:

- Location Create workflow

In Progress:

- Controller Create workflow
- Sensor Create workflow

Current focus:

- Location dropdown integration
- Controller selection integration
- MeasurementTypes-driven rendering

---

# Existing Systems - DO NOT DUPLICATE

The following systems already exist and should NOT be recreated:

- service layer architecture
- repository abstraction
- generalized measurement pipeline
- range-aware history queries
- dashboard aggregation endpoint
- relational location joins
- MeasurementTypes API
- grouped dashboard aggregation
- sensor history pipeline

Before creating new systems:

1. Verify the capability does not already exist
2. Extend existing architecture first
3. Avoid parallel implementations

---

# Known Technical Debt

Current technical debt:

- request DTO naming inside QueryResults
- legacy SensorReadings table
- SensorReadingsV2 artifacts
- hardcoded firmware sensorId
- frontend partially hardcoded for display metadata

Technical debt should NOT interrupt current feature completion.

---

# Current Active Backend Milestone

Current milestone:

- stabilize MeasurementTypes integration
- support frontend metadata-driven rendering
- support provisioning/setup workflows
- maintain stable generalized measurement architecture

Current backend architecture is considered stable.

---

# Deferred Work

Explicitly deferred:

- auth
- MQTT
- batch measurement endpoints
- advanced analytics
- pagination
- infrastructure automation
- DTO restructuring
- deployment pipelines
- large-scale cleanup
- architecture rewrites
- overengineering

Do NOT prioritize cleanup over feature completion.

---

# Current Branch Strategy

Backend feature work should use focused branches.

Examples:

- feature/location-management
- feature/angular-measurement-type-config
- feature/sensor-provisioning

Keep branches:

- focused
- mergeable
- milestone-oriented

---

# Validation Workflow

Build backend:

```bash
dotnet build ./Sensor.Api.Web/Sensor.Api.Web.csproj
```

Run backend:

```bash
dotnet run --project ./Sensor.Api.Web/Sensor.Api.Web.csproj
```

Swagger:

- http://localhost:5278/swagger

API validation examples:

```bash
curl http://localhost:5278/api/status
curl http://localhost:5278/api/dashboard/measurements
curl http://localhost:5278/api/measurement-types
curl http://localhost:5278/api/controllers
curl http://localhost:5278/api/locations
```

---

# Important Project Guidance

This backend is no longer an early prototype.

The core architecture already exists and is functioning.

Future work should focus on:

- extending current systems
- completing workflows
- stabilizing integration
- evolving metadata-driven rendering
- supporting provisioning/setup workflows

Avoid:

- duplicate architectures
- unnecessary abstractions
- speculative redesigns
- framework rewrites
- parallel implementations
