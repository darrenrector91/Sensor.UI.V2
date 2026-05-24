import { DashboardMeasurement } from './dashboard-measurement';

export class ScopedMeasurementGroup {
  constructor(
    public measurementType: string,
    public measurements: DashboardMeasurement[]
  ) {}
}
