export class CreateSensorRequest {
  controllerId!: number;
  locationId: number | null = null;
  name = '';
  hardwareModel = '';
  description = '';
  measurementTypeIds: number[] = [];
  communicationProtocol = '';
  address: string | null = null;
  measurementIntervalSeconds = 300;
  notes = '';
  isActive = true;
}
