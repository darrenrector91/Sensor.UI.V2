import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DashboardMeasurement } from '../../models/dashboard-measurement';

@Component({
  selector: 'app-scoped-health-summary',
  imports: [DatePipe],
  templateUrl: './scoped-health-summary.html',
  styleUrl: './scoped-health-summary.scss'
})
export class ScopedHealthSummary {
  readonly measurements = input.required<DashboardMeasurement[]>();
  readonly latestUpdatedUtc = input<string | null>(null);

  protected readonly sensorCount = computed(() =>
    new Set(this.measurements().map(measurement => measurement.sensorId)).size
  );

  protected readonly measurementTypeCount = computed(() =>
    new Set(this.measurements().map(measurement => measurement.measurementType)).size
  );

  protected readonly measurementRowCount = computed(() => this.measurements().length);

  protected readonly statusLabel = computed(() =>
    this.measurementRowCount() > 0 ? 'Online' : 'No Data'
  );
}
