import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CreateControllerRequest } from '../models/createControllerRequest';
import { CreateSensorRequest } from '../models/createSensorRequest';
import { CreateLocationRequest } from '../models/createLocationRequest';

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
}
