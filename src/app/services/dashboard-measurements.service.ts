import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardMeasurement } from '../models/dashboard-measurement';
import { environment } from '../../environments/environment';
import { SensorMeasurementHistory } from '../models/sensor-measurement-history';

@Injectable({
  providedIn: 'root',
})
export class DashboardMeasurementsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = environment.apiBaseUrl;

  getMeasurements(): Observable<DashboardMeasurement[]> {
    return this.http.get<DashboardMeasurement[]>(`${this.apiBaseUrl}/api/dashboard/measurements`);
  }

  getSensorMeasurements(
    sensorId: number,
    fromUtc?: string,
    toUtc?: string,
    limit = 500,
  ): Observable<SensorMeasurementHistory[]> {
    let params = new HttpParams().set('limit', limit);

    if (fromUtc) {
      params = params.set('fromUtc', fromUtc);
    }

    if (toUtc) {
      params = params.set('toUtc', toUtc);
    }

    return this.http.get<SensorMeasurementHistory[]>(
      `${this.apiBaseUrl}/api/sensors/${sensorId}/measurements`,
      { params },
    );
  }
}
