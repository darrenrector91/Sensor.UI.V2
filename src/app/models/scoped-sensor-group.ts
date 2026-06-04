import { ScopedMeasurementGroup } from './scoped-measurement-group';

export class ScopedSensorGroup {
  constructor(
    public sensorId: number,
    public sensorName: string,
    public controllerKey: string,
    public sensorType: string,
    public measurementGroups: ScopedMeasurementGroup[],
  ) {}
}
