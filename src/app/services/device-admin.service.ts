import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Controller } from '../models/controller';
import { CreateControllerRequest } from '../models/create-controller-request';
import { CreateLocationRequest } from '../models/create-location-request';
import { CreateSensorRequest } from '../models/create-sensor-request';
import { DashboardLocation } from '../models/dashboard-location';
import { Sensor } from '../models/sensor';
import { API_BASE_URL } from '../core/api/api-url.token';

@Injectable({
  providedIn: 'root',
})
export class DeviceAdminService {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  constructor(httpClient: HttpClient) {}

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

  getControllers(): Observable<Controller[]> {
    return this.httpClient.get<Controller[]>(`${this.apiBaseUrl}/controllers`);
  }

  getControllerDetails(id: number): Observable<Controller> {
    return this.httpClient.get<Controller>(`${this.apiBaseUrl}/controllers/${id}`);
  }

  getSensors(controllerId: number): Observable<Sensor[]> {
    return this.httpClient.get<Sensor[]>(`${this.apiBaseUrl}/sensors`, {
      params: {
        controllerId: controllerId.toString(),
      },
    });
  }
}
