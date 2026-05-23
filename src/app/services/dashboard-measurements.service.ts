import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardMeasurement } from '../models/dashboard-measurement';

@Injectable({
  providedIn: 'root'
})
export class DashboardMeasurementsService {
  private readonly http = inject(HttpClient);
  private readonly apiBaseUrl = 'http://192.168.5.103:5278';

  getMeasurements(): Observable<DashboardMeasurement[]> {
    return this.http.get<DashboardMeasurement[]>(`${this.apiBaseUrl}/api/dashboard/measurements`);
  }
}
