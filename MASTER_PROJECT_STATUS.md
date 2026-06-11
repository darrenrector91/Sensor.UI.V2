# Sensor.Api - MASTER PROJECT STATUS

Last Updated: 2026-06-11

---

# Project Purpose

Sensor.Api is the backend platform for the generalized IoT sensor system.

The API receives sensor measurements from ESP32 devices, stores them in PostgreSQL, and serves controller, sensor, location, measurement type, measurement, and dashboard data to the Angular frontend.

The platform has evolved from a hardcoded temperature/humidity design into a generalized:

```text
Controller
-> Sensor hardware
-> Measurement types
-> Measurements
```

architecture.

The backend is operating with production-style layering and should be extended rather than redesigned.

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

```text
Controller
-> IService
-> Service
-> IRepository
-> Repository
```

Responsibilities:

Controller:

- HTTP routing
- model binding
- response codes
- thin request handling
- inject services only

Service:

- business logic
- validation
- orchestration
- normalization
- response shaping
- calls repositories

Repository:

- SQL
- Dapper mapping
- database access only

Repositories should NOT contain business rules.

Controllers should NOT inject repositories directly.

---

# Current Database

Database:

- sensor_data

User:

- sensor_api

Primary active tables:

- Controllers
- Sensors
- SensorMeasurementTypes
- SensorMeasurements
- MeasurementTypes
- Locations

Removed legacy tables:

- SensorReadings
- SensorReadingsV2

SensorMeasurements is the active measurement data table.

SensorMeasurementTypes is the join table that defines which measurement types each physical sensor supports.

---

# Current Platform Direction

Preferred architecture:

```text
Controller
-> Sensor hardware
-> Supported MeasurementTypes
-> SensorMeasurements
```

Important naming distinction:

- Sensor hardware/model examples: SHT35, DS18B20, BME280, capacitive soil moisture sensor
- Measurement type examples: Temperature, Humidity, SoilMoisture, SoilTemperature, BatteryVoltage
- Sensor instance examples: Deck SHT35, Basement SHT35, Tomato Soil Probe

A physical sensor can support multiple measurement types.

Example:

```text
SHT35
- Temperature
- Humidity
```

The system intentionally supports:

- Temperature
- Humidity
- Soil moisture
- Soil temperature
- Light
- Battery voltage
- Water level
- Pump state
- Door state
- Future measurement types

without creating new measurement tables for each reading type.

---

# Current Sensor Model

Sensors now represent physical sensor hardware connected to a controller.

Current Sensors direction:

- Id
- ControllerId
- LocationId
- Name
- HardwareModel
- Description
- CommunicationProtocol
- Address
- MeasurementIntervalSeconds
- Notes
- IsActive
- CreatedUtc

Removed sensor fields:

- SensorKey
- SensorType

SensorType was replaced by HardwareModel.

SensorKey was removed because grouping is handled better by ControllerId, LocationId, HardwareModel, and SensorMeasurementTypes.

Sensor create/update request models include:

- MeasurementTypeIds

These IDs are not stored on the Sensors table. They are stored through SensorMeasurementTypes.

---

# Current SensorMeasurementTypes Model

SensorMeasurementTypes maps physical sensors to the measurement types they support.

Schema direction:

- SensorId
- MeasurementTypeId

Examples:

```text
Deck SHT35 -> Temperature
Deck SHT35 -> Humidity
Soil Probe -> SoilMoisture
Soil Probe -> SoilTemperature
```

Create and update sensor workflows should:

1. Save/update the Sensors row.
2. Replace or insert SensorMeasurementTypes rows inside the same transaction.

---

# Current Measurement Model

Current measurement pipeline still supports generalized measurement rows.

Target SensorMeasurements schema:

- Id
- SensorId
- MeasurementTypeId
- Value
- Unit
- CreatedUtc

Legacy/current transition note:

- Some code or local data may still reference MeasurementType as text while the refactor is being completed.
- The intended direction is MeasurementTypeId with a foreign key to MeasurementTypes.
- Dashboard and history queries should join MeasurementTypes by Id once the measurement write path is fully converted.

Preferred target query pattern:

```sql
LEFT JOIN "MeasurementTypes" mt
    ON mt."Id" = m."MeasurementTypeId"
```

Legacy temporary query pattern:

```sql
LEFT JOIN "MeasurementTypes" mt
    ON mt."Name" = m."MeasurementType"
```

Use the target pattern after SensorMeasurements has MeasurementTypeId.

---

# Current MeasurementTypes Direction

MeasurementTypes is the source of truth for frontend display metadata.

MeasurementTypes fields currently include:

- Id
- Name
- DisplayName
- DefaultUnit
- Icon
- DisplayKind
- Priority
- CssClass
- AccentColor
- Description
- IsActive
- CreatedUtc
- Color
- DisplayStyle
- ChartGroup

MeasurementTypes should drive:

- icons
- colors
- display styles
- chart grouping
- priority
- css styling
- default units
- frontend card/chart rendering behavior

Angular should stop hardcoding:

- temperature display config
- humidity display config
- measurement-specific dashboard styling

---

# Current Backend Features

## Controllers

Implemented:

- GET /api/controllers
- GET /api/controllers/{id}
- POST /api/controllers
- PUT /api/controllers/{id}

Controller list/detail queries should return one row per controller.

When joining sensors for controller cards, use aggregation:

- COUNT(s."Id") AS "SensorCount"

Do not return one controller row per sensor.

---

## Sensors

Implemented:

- GET /api/controllers/{controllerId}/sensors
- GET /api/sensors/{id}
- POST /api/sensors
- PUT /api/sensors/{id}

Sensor create/update supports:

- physical hardware fields
- LocationId
- MeasurementTypeIds
- SensorMeasurementTypes mapping

Sensor responses should use:

- HardwareModel
- LocationName
- CommunicationProtocol
- Address
- MeasurementIntervalSeconds
- Notes

Sensor responses should NOT use:

- SensorKey
- SensorType

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

Range-aware history querying is implemented.

Measurement write/read code should be reviewed during the MeasurementTypeId migration.

---

## MeasurementTypes

Implemented:

- GET /api/measurement-types
- POST /api/measurement-types

MeasurementTypes table exists and is seeded.

MeasurementTypes are now also used to define valid measurement capabilities for sensors through SensorMeasurementTypes.

---

## Locations

Implemented:

- GET /api/locations
- GET /api/locations/{id}
- POST /api/locations
- PUT /api/locations/{id}
- DELETE /api/locations/{id}

Locations are relational and integrated into:

- Controllers
- Sensors
- Dashboard queries

Location display should use:

- LocationId
- LocationName

Avoid ambiguous response property names like Location when LocationName is clearer.

---

## Status

Implemented:

- GET /api/status
- GET /api/status/database

---

# Relational Location System

Controllers:

- LocationId
- resolved LocationName through LEFT JOIN

Sensors:

- LocationId
- resolved LocationName through LEFT JOIN

Dashboard measurements:

- resolve LocationName through LEFT JOIN

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

Important repository rules:

- Controller repositories should not return duplicate controller rows because of sensor joins.
- Use COUNT/GROUP BY for controller sensor counts.
- Sensor create/update should use transactions when writing SensorMeasurementTypes.
- Repositories should not shape business rules.

---

# Current QueryResults and Request DTO State

The project intentionally uses:

- QueryResults

folder naming for database projection models.

DO NOT:

- rename QueryResults
- replace QueryResults
- introduce a QueryRequests folder

Current direction:

- QueryResults contains returned database projection models.
- Request DTOs belong in Sensor.Api.Core/Requests.

Sensor request DTO cleanup has started.

Current request DTO direction:

- Sensor.Api.Core/Requests/CreateSensorRequest.cs
- Sensor.Api.Core/Requests/UpdateSensorRequest.cs

Sensor QR/query models remain in:

- Sensor.Api.Data/QueryResults/SensorQR.cs
- Sensor.Api.Data/QueryResults/SensorMeasurementQR.cs
- Sensor.Api.Data/QueryResults/DashboardMeasurementQR.cs
- Sensor.Api.Data/QueryResults/MeasurementTypeQR.cs
- Sensor.Api.Data/QueryResults/SensorMeasurementTypeQR.cs

Known technical debt:

- Some older request DTOs may still use QR naming.
- Continue moving request models to Core/Requests as they are touched.
- Do not create a QueryRequests folder.

---

# Current API Response Naming Direction

Preferred response fields:

- LocationId
- LocationName
- HardwareModel
- MeasurementTypeId
- MeasurementType
- MeasurementDisplayName
- SensorCount

Avoid old response fields:

- SensorKey
- SensorType
- Location when LocationName is intended

Dashboard measurement responses should include measurement metadata when available:

- Icon
- Color
- DisplayStyle
- ChartGroup
- Priority
- CssClass

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

Current/legacy payload shape:

```json
{
  "measurementType": "Temperature",
  "value": "22.6",
  "unit": "C"
}
```

Target payload shape after measurement write-path refactor:

```json
{
  "measurementTypeId": 1,
  "value": 22.6,
  "unit": "C"
}
```

Current firmware behavior:

- hardcoded sensorId = 1
- hourly posting interval (3600000 ms)
- temperature and humidity are posted as separate measurements

ESP32 Network Information:

- ESP32 IP: 192.168.4.34
- Raspberry Pi API: 192.168.5.103
- API Base URL: http://192.168.5.103:5278
- Measurements Endpoint: http://192.168.5.103:5278/api/sensors/1/measurements

Validated Behavior:

- ESP32 posts once per hour
- Temperature and Humidity are stored as separate rows
- SensorMeasurements contains the active measurement data
- Historical 2-minute readings originated from removed legacy SensorReadings data
- Current SensorMeasurements data has been verified as hourly

---

# Current Frontend Integration Expectations

Frontend consumes:

- dashboard measurements
- range-aware history
- grouped controller/sensor data
- controller list/cards
- sensor list/table data

Frontend direction:

- load MeasurementTypes from backend
- eliminate hardcoded frontend display config
- use HardwareModel for physical sensor display
- use MeasurementTypes metadata for dashboard measurement display
- remove dependencies on SensorKey and SensorType

Angular Sensor model direction:

- id
- controllerId
- locationId
- locationName
- name
- hardwareModel
- description
- communicationProtocol
- address
- measurementIntervalSeconds
- notes
- isActive
- createdUtc

---

# Current Angular Admin Status

Completed/recently stabilized:

- Location Create workflow
- Controller list rendering after backend refactor
- Sensor data rendering after backend refactor
- Sensor create/update request shape
- Connected sensors line/table model cleanup

In Progress:

- Controller Create workflow
- Sensor Create workflow
- Sensor Update workflow
- Angular cleanup of old sensorKey/sensorType references

Current focus:

- Location dropdown integration
- Controller selection integration
- MeasurementTypes-driven rendering
- sensor provisioning workflow stabilization

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
- sensor provisioning create/update path
- SensorMeasurementTypes capability mapping

Before creating new systems:

1. Verify the capability does not already exist.
2. Extend existing architecture first.
3. Avoid parallel implementations.

---

# Known Technical Debt

Current technical debt:

- remaining old request DTO naming in some areas
- possible remaining SensorKey/SensorType references in Angular or older queries
- SensorReadingsV2 artifacts/documentation cleanup
- hardcoded firmware sensorId
- frontend partially hardcoded for display metadata
- SensorMeasurements MeasurementType string to MeasurementTypeId migration may still need final write-path completion
- measurement value type consistency between database, DTOs, and charting code

Technical debt should NOT interrupt current feature completion unless it blocks build/runtime stability.

---

# Current Active Backend Milestone

Current milestone:

- stabilize sensor provisioning after backend refactor
- stabilize MeasurementTypes integration
- support frontend metadata-driven rendering
- support setup/provisioning workflows
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
- deployment pipelines
- large-scale cleanup
- architecture rewrites
- overengineering

Do NOT prioritize broad cleanup over feature completion.

---

# Current Branch Strategy

Backend feature work should use focused branches.

Examples:

- feature/location-management
- feature/angular-measurement-type-config
- feature/sensor-provisioning
- feature/sensor-measurement-type-refactor

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
curl http://localhost:5278/api/controllers/1/sensors
```

SQL validation examples:

```sql
SELECT *
FROM "Controllers";

SELECT *
FROM "Sensors";

SELECT *
FROM "SensorMeasurementTypes";

SELECT *
FROM "MeasurementTypes";

SELECT *
FROM "SensorMeasurements";
```

Controller list/card query rule:

```text
Controller cards should show one row per controller.
Use COUNT(s."Id") AS "SensorCount" when joining Sensors.
```

Sensor create/update rule:

```text
MeasurementTypeIds belongs to the request model.
Do not add MeasurementTypeIds as a Sensors table column.
Persist supported measurement types in SensorMeasurementTypes.
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
