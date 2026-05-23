import { DashboardMeasurement } from './dashboard-measurement';
import { MeasurementDisplayConfig } from './measurement-display-config';

export class ControllerCardMetric {
  constructor(
    public measurement: DashboardMeasurement,
    public config: MeasurementDisplayConfig
  ) {}
}
