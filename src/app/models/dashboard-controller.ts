import { DashboardMeasurement } from './dashboard-measurement';
import { DashboardSensor } from './dashboard-sensor';

export class DashboardController {
  constructor(
    public controllerId: number,
    public controllerKey: string,
    public controllerName: string,
    public location: string,
    public sensors: DashboardSensor[]
  ) {}

  get sensorCount(): number {
    return this.sensors.length;
  }

  get lastUpdatedUtc(): string | null {
    const measurements = this.sensors.flatMap(sensor => sensor.measurements);

    if (measurements.length === 0) {
      return null;
    }

    return measurements.reduce((latest: DashboardMeasurement, current: DashboardMeasurement) =>
      new Date(current.createdUtc).getTime() > new Date(latest.createdUtc).getTime()
        ? current
        : latest
    ).createdUtc;
  }
}
