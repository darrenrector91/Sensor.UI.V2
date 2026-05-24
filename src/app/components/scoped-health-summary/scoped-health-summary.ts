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

  private readonly staleThresholdMilliseconds = 2 * 60 * 60 * 1000;

  protected readonly sensorCount = computed(() =>
    new Set(this.measurements().map(measurement => measurement.sensorId)).size
  );

  protected readonly measurementTypeCount = computed(() =>
    new Set(this.measurements().map(measurement => measurement.measurementType)).size
  );

  protected readonly measurementRowCount = computed(() => this.measurements().length);

  protected readonly statusLabel = computed(() => {
    if (this.measurementRowCount() === 0) {
      return 'No Data';
    }

    const latestUpdatedUtc = this.latestUpdatedUtc();

    if (!latestUpdatedUtc) {
      return 'Unknown';
    }

    const latestUpdatedTime = new Date(latestUpdatedUtc).getTime();
    const ageMilliseconds = Date.now() - latestUpdatedTime;

    return ageMilliseconds > this.staleThresholdMilliseconds ? 'Stale' : 'Recent';
  });

  protected readonly statusClass = computed(() => {
    switch (this.statusLabel()) {
      case 'Recent':
        return 'health-card--recent';

      case 'Stale':
        return 'health-card--stale';

      case 'No Data':
        return 'health-card--empty';

      default:
        return 'health-card--unknown';
    }
  });
}
