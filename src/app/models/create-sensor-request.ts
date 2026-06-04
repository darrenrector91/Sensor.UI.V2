export class CreateSensorRequest {
  controllerId!: number;
  locationId!: number | null;
  controllerKey!: string;
  name!: string;
  sensorType!: string;
  description?: string | null;
  status!: boolean;
  i2cAddress?: string | null;
  measurementIntervalSeconds?: number | null;
  temperatureUnit?: string | null;
  humidityUnit?: string | null;
  notes?: string | null;
}
