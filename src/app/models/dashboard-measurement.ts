export interface DashboardMeasurement {
  controllerId: number;
  controllerKey: string;
  controllerName: string;
  location: string;
  sensorId: number;
  sensorKey: string;
  sensorName: string;
  sensorType: string;
  measurementType: string;
  value: string;
  unit: string;
  createdUtc: string;
}
