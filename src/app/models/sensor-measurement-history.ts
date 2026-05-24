export class SensorMeasurementHistory {
  constructor(
    public id: number,
    public sensorId: number,
    public measurementType: string,
    public value: string,
    public unit: string,
    public createdUtc: string
  ) {}
}
