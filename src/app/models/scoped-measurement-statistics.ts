import { MeasurementDisplayValue } from './measurement-display-value';

export class ScopedMeasurementStatistics {
  constructor(
    public minimum: MeasurementDisplayValue,
    public maximum: MeasurementDisplayValue,
    public average: MeasurementDisplayValue,
    public count: number
  ) {}
}
