export class CreateSensorRequest {
  name!: string;
  sensorType!: string;
  description?: string | null;
  status!: boolean;
  controllerId!: number;
  location!: string;
  deviceIdentifier!: string;
  i2cAddress?: string | null;
  measurementIntervalSeconds?: number | null;
  temperatureUnit?: string | null;
  humidityUnit?: string | null;
  notes?: string | null;
}
