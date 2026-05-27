import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class CreateControllerRequest {
  name!: string;
  location!: string;
  description?: string | null;
  controllerType!: string;
  ipAddress?: string | null;
  deviceIdentifier?: string | null;
  pollIntervalSeconds?: number | null;
  status!: boolean;
  notes?: string | null;
}

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

@Injectable({
  providedIn: 'root',
})
export class DeviceAdminService {
  private readonly apiBaseUrl = 'http://192.168.5.103:5278/api';

  constructor(private readonly httpClient: HttpClient) {}

  createController(request: CreateControllerRequest): Observable<unknown> {
    return this.httpClient.post(`${this.apiBaseUrl}/controllers`, request);
  }

  createSensor(request: CreateSensorRequest): Observable<unknown> {
    return this.httpClient.post(`${this.apiBaseUrl}/sensors`, request);
  }
}
