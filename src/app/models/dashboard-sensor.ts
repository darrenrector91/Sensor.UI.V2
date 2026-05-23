import { DashboardMeasurement } from './dashboard-measurement';

export class DashboardSensor {
  constructor(
    public sensorId: number,
    public sensorKey: string,
    public sensorName: string,
    public sensorType: string,
    public measurements: DashboardMeasurement[]
  ) {}
}
