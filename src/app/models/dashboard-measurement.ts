export class DashboardMeasurement {
  constructor(
    public controllerId: number,
    public controllerKey: string,
    public controllerName: string,
    public location: string,
    public sensorId: number,
    public sensorName: string,
    public sensorType: string,
    public measurementType: string,
    public value: string,
    public unit: string,
    public createdUtc: string,
  ) {}
}
