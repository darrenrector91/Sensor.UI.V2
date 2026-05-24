import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardMeasurement } from '../models/dashboard-measurement';
import { environment } from '../../environments/environment';
import { SensorMeasurementHistory } from '../models/sensor-measurement-history';

@Injectable({
  providedIn: 'root'
})
export class DashboardMeasurementsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getMeasurements(): Observable<DashboardMeasurement[]> {
    return this.http.get<DashboardMeasurement[]>(`${this.apiBaseUrl}/api/dashboard/measurements`);
  }

  getSensorMeasurements(sensorId: number): Observable<SensorMeasurementHistory[]> {
    return this.http.get<SensorMeasurementHistory[]>(`${this.apiBaseUrl}/api/sensors/${sensorId}/measurements`);
  }
}
