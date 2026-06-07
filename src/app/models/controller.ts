export class Controller {
  id!: number;
  controllerKey = '';
  name = '';
  location: string | null = null;
  locationId: number | null = null;
  isActive = false;
  createdUtc = '';
  lastUpdatedDateDisplay = '';
  sensorCount = 0;

  get hasSensors(): boolean {
    return this.sensorCount > 0;
  }

  get statusLabel(): string {
    if (!this.isActive) {
      return 'Inactive';
    }

    return this.hasSensors ? 'Configured' : 'Empty';
  }
}
