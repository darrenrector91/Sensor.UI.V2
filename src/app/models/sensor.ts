export class Sensor {
  id!: number;
  controllerId!: number;
  locationId: number | null = null;
  locationName: string | null = null;
  name = '';
  hardwareModel = '';
  description = '';
  communicationProtocol = '';
  address: string | null = null;
  measurementIntervalSeconds = 0;
  notes = '';
  isActive = false;
  createdUtc = '';

  get statusLabel(): string {
    return this.isActive ? 'Active' : 'Inactive';
  }
}
