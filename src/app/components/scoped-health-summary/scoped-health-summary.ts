import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { ScopedHealthStatus } from '../../models/scoped-health-status';

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

  protected readonly healthStatus = computed(() => {
    if (this.measurementRowCount() === 0) {
      return new ScopedHealthStatus('No Data', 'health-card--empty', 'No readings loaded');
    }

    const latestUpdatedUtc = this.latestUpdatedUtc();

    if (!latestUpdatedUtc) {
      return new ScopedHealthStatus('Unknown', 'health-card--unknown', 'Latest update unavailable');
    }

    const latestUpdatedTime = new Date(latestUpdatedUtc).getTime();
    const ageMilliseconds = Date.now() - latestUpdatedTime;
    const ageLabel = this.formatAgeLabel(ageMilliseconds);

    if (ageMilliseconds > this.staleThresholdMilliseconds) {
      return new ScopedHealthStatus('Stale', 'health-card--stale', ageLabel);
    }

    return new ScopedHealthStatus('Recent', 'health-card--recent', ageLabel);
  });

  private formatAgeLabel(ageMilliseconds: number): string {
    const totalMinutes = Math.max(Math.floor(ageMilliseconds / 60000), 0);

    if (totalMinutes < 1) {
      return 'Updated just now';
    }

    if (totalMinutes < 60) {
      return `Updated ${totalMinutes} minute${totalMinutes === 1 ? '' : 's'} ago`;
    }

    const totalHours = Math.floor(totalMinutes / 60);

    if (totalHours < 24) {
      return `Updated ${totalHours} hour${totalHours === 1 ? '' : 's'} ago`;
    }

    const totalDays = Math.floor(totalHours / 24);

    return `Updated ${totalDays} day${totalDays === 1 ? '' : 's'} ago`;
  }
}
