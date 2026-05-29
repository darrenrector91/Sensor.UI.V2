import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateControllerRequest } from '../models/create-controller-request';
import { CreateLocationRequest } from '../models/create-location-request';
import { CreateSensorRequest } from '../models/create-sensor-request';
import { DashboardLocation } from '../models/dashboard-location';
import { DashboardController } from '../models/dashboard-controller';

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

  createLocation(request: CreateLocationRequest): Observable<unknown> {
    return this.httpClient.post(`${this.apiBaseUrl}/locations`, request);
  }

  getLocations(): Observable<DashboardLocation[]> {
    return this.httpClient.get<DashboardLocation[]>(`${this.apiBaseUrl}/locations`);
  }

  getControllers(): Observable<DashboardController[]> {
    return this.httpClient.get<DashboardController[]>(`${this.apiBaseUrl}/controllers`);
  }
}
