import { DashboardMeasurement } from './dashboard-measurement';

export interface DashboardSensor {
  sensorId: number;
  sensorKey: string;
  sensorName: string;
  sensorType: string;
  measurements: DashboardMeasurement[];
}
