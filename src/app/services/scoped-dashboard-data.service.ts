import { Injectable } from '@angular/core';
import { DateSelectionModelChange } from '@angular/material/datepicker';
import { Observable } from 'rxjs';
import { Controller } from '../models/controller';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ScopedDashboardDataService {
  private readonly apiBaseUrl = 'http://localhost:5278/api';

  constructor(private readonly httpClient: HttpClient) {}

  loadScopedMeasurements(
    scope: string,
    scopeValue: string,
    timeRange: { start: Date; end: Date },
  ): Observable<Controller[]> {
    return this.httpClient.get<Controller[]>(`${this.apiBaseUrl}/controllers`);
  }
}
