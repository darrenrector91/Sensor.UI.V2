export class Sensor {
  controllerId!: number;
  sensorKey = '';
  name = '';
  sensorType = '';
  isActive = false;
  createdUtc = '';
  locationId: number | null = null;

  get statusLabel(): string {
    return this.isActive ? 'Active' : 'Inactive';
  }
}
