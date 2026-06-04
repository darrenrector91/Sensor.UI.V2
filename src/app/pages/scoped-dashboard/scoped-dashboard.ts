import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, forkJoin, map, Observable, of, switchMap } from 'rxjs';
import { DashboardScope } from '../../enums/dashboard-scope';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { ScopedMeasurementGroup } from '../../models/scoped-measurement-group';
import { ScopedSensorGroup } from '../../models/scoped-sensor-group';
import { SensorMeasurementHistory } from '../../models/sensor-measurement-history';
import { ScopedDashboardHeader } from '../../components/scoped-dashboard-header/scoped-dashboard-header';
import { ScopedLatestMeasurements } from '../../components/scoped-latest-measurements/scoped-latest-measurements';
import { ScopedMeasurementPanel } from '../../components/scoped-measurement-panel/scoped-measurement-panel';
import { ScopedHealthSummary } from '../../components/scoped-health-summary/scoped-health-summary';
import { ScopedTimeRange } from '../../components/scoped-time-range-selector/scoped-time-range-selector';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { MeasurementDisplayConfigService } from '../../services/measurement-display-config.service';

@Component({
  selector: 'app-scoped-dashboard',
  imports: [
    CommonModule,
    ScopedDashboardHeader,
    ScopedLatestMeasurements,
    ScopedMeasurementPanel,
    ScopedHealthSummary,
  ],
  templateUrl: './scoped-dashboard.html',
  styleUrl: './scoped-dashboard.scss',
})
export class ScopedDashboard implements OnInit {
  // Route services identify which scoped dashboard is being viewed and keep the range in the URL.
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);
  // This service loads both enriched dashboard metadata and lean sensor history rows.
  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);
  // Display config controls measurement ordering, labels, icons, and colors without hardcoding sensor types here.
  private readonly measurementDisplayConfigService = inject(MeasurementDisplayConfigService);

  // Full working measurement set for this scoped page after backend history rows are mapped to dashboard rows.
  protected readonly measurements = signal<DashboardMeasurement[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly scope = signal<DashboardScope | null>(null);
  protected readonly scopeValue = signal<string | null>(null);
  // The selected chart/history window is mirrored into the route query string.
  protected readonly selectedTimeRange = signal<ScopedTimeRange>('7D');

  // Keep all derived UI sections working from one scoped and time-filtered measurement list.
  protected readonly filteredMeasurements = computed(() =>
    this.filterMeasurementsByTimeRange(this.filterMeasurementsForScope(this.measurements())),
  );

  // Pick the newest row for each sensor/type pair so the latest cards do not show duplicates.
  protected readonly latestMeasurements = computed(() => {
    const measurementMap = new Map<string, DashboardMeasurement>();

    for (const measurement of this.filteredMeasurements()) {
      // Sensor id plus measurement type uniquely identifies one latest value card.
      const key = `${measurement.sensorId}-${measurement.measurementType}`;
      const existingMeasurement = measurementMap.get(key);

      // Replace the stored value only when this row is newer than the current latest row.
      if (
        !existingMeasurement ||
        new Date(measurement.createdUtc).getTime() >
          new Date(existingMeasurement.createdUtc).getTime()
      ) {
        measurementMap.set(key, measurement);
      }
    }

    return Array.from(measurementMap.values()).sort(
      (first, second) =>
        this.getMeasurementPriority(first.measurementType) -
        this.getMeasurementPriority(second.measurementType),
    );
  });

  // Group rows first by sensor and then by measurement type for the chart panels.
  protected readonly groupedSensors = computed(() => {
    const sensorMap = new Map<number, DashboardMeasurement[]>();

    for (const measurement of this.filteredMeasurements()) {
      // Sensor id plus measurement type uniquely identifies one latest value card.
      const existingMeasurements = sensorMap.get(measurement.sensorId) ?? [];
      existingMeasurements.push(measurement);
      sensorMap.set(measurement.sensorId, existingMeasurements);
    }

    return Array.from(sensorMap.entries()).map(([sensorId, measurements]) => {
      const measurementTypeMap = new Map<string, DashboardMeasurement[]>();

      for (const measurement of measurements) {
        const existingMeasurements = measurementTypeMap.get(measurement.measurementType) ?? [];
        existingMeasurements.push(measurement);
        measurementTypeMap.set(measurement.measurementType, existingMeasurements);
      }

      // Each measurement type becomes one chart/stat group, sorted newest-first for display.
      const measurementGroups = Array.from(measurementTypeMap.entries())
        .map(
          ([measurementType, groupedMeasurements]) =>
            new ScopedMeasurementGroup(
              measurementType,
              groupedMeasurements.sort(
                (first, second) =>
                  new Date(second.createdUtc).getTime() - new Date(first.createdUtc).getTime(),
              ),
            ),
        )
        .sort(
          (first, second) =>
            this.getMeasurementPriority(first.measurementType) -
            this.getMeasurementPriority(second.measurementType),
        );

      return new ScopedSensorGroup(
        sensorId,
        measurements[0]?.sensorName ?? `Sensor ${sensorId}`,
        measurements[0]?.controllerKey ?? '',
        measurements[0]?.sensorType ?? '',
        measurementGroups,
      );
    });
  });

  // Page title falls back to route values until measurement metadata has loaded.
  protected readonly title = computed(() => {
    const scope = this.scope();
    const scopeValue = this.scopeValue();
    const firstMeasurement = this.filteredMeasurements()[0];

    if (!scope || !scopeValue) {
      return 'Dashboard';
    }

    switch (scope) {
      case DashboardScope.Controller:
        return firstMeasurement?.controllerName ?? `Controller ${scopeValue}`;

      case DashboardScope.Location:
        return firstMeasurement?.location ?? `${scopeValue} Location`;

      case DashboardScope.Sensor:
        return firstMeasurement?.sensorName ?? `Sensor ${scopeValue}`;
    }
  });

  // Subtitle adds the most useful identifying metadata for the active dashboard scope.
  protected readonly subtitle = computed(() => {
    const scope = this.scope();
    const firstMeasurement = this.filteredMeasurements()[0];

    if (!scope) {
      return '';
    }

    switch (scope) {
      case DashboardScope.Controller:
        return firstMeasurement
          ? `${firstMeasurement.controllerKey} · ${firstMeasurement.location}`
          : 'Controller detail';

      case DashboardScope.Location:
        return 'All sensors in this location';

      case DashboardScope.Sensor:
        return firstMeasurement
          ? `${firstMeasurement.controllerKey} · ${firstMeasurement.sensorType}`
          : 'Sensor detail';
    }
  });

  // Health summary uses the newest timestamp in the current scoped range.
  protected readonly latestUpdatedUtc = computed(() => {
    const sortedMeasurements = [...this.filteredMeasurements()].sort(
      (first, second) =>
        new Date(second.createdUtc).getTime() - new Date(first.createdUtc).getTime(),
    );

    return sortedMeasurements[0]?.createdUtc ?? null;
  });

  // Distinguish between no data for this scope and no data inside the selected time range.
  protected readonly emptyStateMessage = computed(() => {
    const scopedMeasurements = this.filterMeasurementsForScope(this.measurements());

    if (scopedMeasurements.length === 0) {
      return 'No measurements found for this scope.';
    }

    return `No measurements found for the selected ${this.selectedTimeRange()} range.`;
  });

  ngOnInit(): void {
    // Route scope and query string range must be set before the first data load.
    this.setScopeFromRoute();
    this.setTimeRangeFromRoute();
    this.loadMeasurements();
  }

  protected selectTimeRange(range: ScopedTimeRange): void {
    // Update the signal first so the reload and derived computed values use the new range.
    this.selectedTimeRange.set(range);

    // Persist the range in the URL without adding a new browser history entry.
    void this.router.navigate([], {
      relativeTo: this.activatedRoute,
      queryParams: {
        range,
      },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });

    this.loadMeasurements();
  }

  protected loadMeasurements(): void {
    // Reset the visible load/error state for every explicit reload.
    this.isLoading.set(true);
    this.errorMessage.set(null);

    const scope = this.scope();
    const scopeValue = this.scopeValue();
    // Use one consistent UTC window for every request in this load cycle.
    const toUtc = new Date();
    const fromUtc = this.getTimeRangeCutoffUtc(this.selectedTimeRange());

    // This should only happen if the union type is expanded without updating the range mapping.
    if (!fromUtc) {
      this.isLoading.set(false);
      this.errorMessage.set('Invalid dashboard time range.');
      return;
    }

    // Sensor pages only need one history request after dashboard metadata is loaded.
    if (scope === DashboardScope.Sensor && scopeValue) {
      this.dashboardMeasurementsService
        .getMeasurements()
        .pipe(
          switchMap((metadataRows) =>
            // Load only this sensor's history from the backend for the selected time range,
            // then enrich the lean history rows with dashboard metadata for chart rendering.
            this.dashboardMeasurementsService
              .getSensorMeasurements(
                Number(scopeValue),
                fromUtc.toISOString(),
                toUtc.toISOString(),
                500,
              )
              .pipe(
                map((historyRows) =>
                  this.mapHistoryToDashboardMeasurements(historyRows, metadataRows),
                ),
              ),
          ),
          finalize(() => this.isLoading.set(false)),
        )
        .subscribe({
          next: (measurements) => this.measurements.set(measurements),
          error: () => this.errorMessage.set('Unable to load scoped dashboard measurements.'),
        });

      return;
    }

    // Controller and location pages start from enriched dashboard metadata so we know which sensors are in scope.
    this.dashboardMeasurementsService
      .getMeasurements()
      .pipe(
        switchMap((measurements) => {
          const scopedMeasurements = this.filterMeasurementsForScope(measurements);
          // Load history only for sensors that belong to the active controller or location.
          const sensorIds = Array.from(
            new Set(scopedMeasurements.map((measurement) => measurement.sensorId)),
          );

          // No matching sensors means the scoped metadata itself is the complete empty result.
          if (sensorIds.length === 0) {
            return of(scopedMeasurements);
          }

          // Keep the request array strongly typed so forkJoin does not infer unknown or any.
          const historyRequests: Observable<SensorMeasurementHistory[]>[] = sensorIds.map(
            (sensorId) =>
              this.dashboardMeasurementsService.getSensorMeasurements(
                sensorId,
                fromUtc.toISOString(),
                toUtc.toISOString(),
                500,
              ),
          );

          return forkJoin(historyRequests).pipe(
            // Each sensor returns its own history array, so flatten before mapping back to dashboard rows.
            map((sensorHistories: SensorMeasurementHistory[][]) =>
              this.mapHistoryToDashboardMeasurements(sensorHistories.flat(), scopedMeasurements),
            ),
          );
        }),
        finalize(() => this.isLoading.set(false)),
      )
      .subscribe({
        next: (measurements) => this.measurements.set(measurements),
        error: () => this.errorMessage.set('Unable to load scoped dashboard measurements.'),
      });
  }

  // Measurement priority keeps cards and chart groups in the configured display order.
  private getMeasurementPriority(measurementType: string): number {
    return this.measurementDisplayConfigService.getConfig(measurementType).priority;
  }

  // Convert lean backend history rows into the richer dashboard model used by this component tree.
  private mapHistoryToDashboardMeasurements(
    historyRows: SensorMeasurementHistory[],
    metadataRows: DashboardMeasurement[],
  ): DashboardMeasurement[] {
    return (
      historyRows
        .map((historyRow) => {
          // The history endpoint returns lean measurement rows, so reuse dashboard metadata
          // to rebuild the richer DashboardMeasurement shape expected by the scoped UI.
          const metadata = metadataRows.find((row) => row.sensorId === historyRow.sensorId);

          // If metadata is missing, the row cannot be safely displayed in the scoped dashboard.

          if (!metadata) {
            return null;
          }

          return new DashboardMeasurement(
            metadata.controllerId,
            metadata.controllerKey,
            metadata.controllerName,
            metadata.location,
            historyRow.sensorId,
            metadata.sensorName,
            metadata.sensorType,
            historyRow.measurementType,
            historyRow.value,
            historyRow.unit,
            historyRow.createdUtc,
          );
        })
        // The type guard removes nulls and tells TypeScript the result is DashboardMeasurement[].
        .filter((measurement): measurement is DashboardMeasurement => measurement !== null)
    );
  }

  // Keep a client-side range filter as a safety net after the backend has already range-filtered history.
  private filterMeasurementsByTimeRange(
    measurements: DashboardMeasurement[],
  ): DashboardMeasurement[] {
    const cutoffUtc = this.getTimeRangeCutoffUtc(this.selectedTimeRange());

    // Unknown ranges should not hide data; validation happens when loading from the backend.
    if (!cutoffUtc) {
      return measurements;
    }

    return measurements.filter(
      (measurement) => new Date(measurement.createdUtc).getTime() >= cutoffUtc.getTime(),
    );
  }

  // Translate the selected range into the lower UTC bound sent to the API and used by the local filter.
  private getTimeRangeCutoffUtc(range: ScopedTimeRange): Date | null {
    const now = new Date();

    switch (range) {
      case '6H':
        return new Date(now.getTime() - 6 * 60 * 60 * 1000);

      case '24H':
        return new Date(now.getTime() - 24 * 60 * 60 * 1000);

      case '7D':
        return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

      case '30D':
        return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }
  }

  // Apply the route scope to a measurement list, whether it came from metadata or mapped history.
  private filterMeasurementsForScope(measurements: DashboardMeasurement[]): DashboardMeasurement[] {
    const scope = this.scope();
    const scopeValue = this.scopeValue();

    if (!scope || !scopeValue) {
      return [];
    }

    return measurements.filter((measurement) => {
      // Each route type uses its matching identifier from the dashboard measurement model.
      switch (scope) {
        case DashboardScope.Controller:
          return measurement.controllerId === Number(scopeValue);

        case DashboardScope.Location:
          return measurement.location.toLowerCase() === scopeValue.toLowerCase();

        case DashboardScope.Sensor:
          return measurement.sensorId === Number(scopeValue);
      }
    });
  }

  // Read the optional range query parameter on initial load.
  private setTimeRangeFromRoute(): void {
    const range = this.activatedRoute.snapshot.queryParamMap.get('range');

    if (this.isScopedTimeRange(range)) {
      this.selectedTimeRange.set(range);
    }
  }

  // Type guard keeps route query string values inside the supported range union.
  private isScopedTimeRange(value: string | null): value is ScopedTimeRange {
    return value === '6H' || value === '24H' || value === '7D' || value === '30D';
  }

  // Infer the scoped dashboard type from the configured route path and capture its route parameter.
  private setScopeFromRoute(): void {
    const routeConfigPath = this.activatedRoute.snapshot.routeConfig?.path ?? '';

    if (routeConfigPath.includes('controller')) {
      this.scope.set(DashboardScope.Controller);
      this.scopeValue.set(this.activatedRoute.snapshot.paramMap.get('controllerId'));
      return;
    }

    if (routeConfigPath.includes('location')) {
      this.scope.set(DashboardScope.Location);
      this.scopeValue.set(this.activatedRoute.snapshot.paramMap.get('location'));
      return;
    }

    if (routeConfigPath.includes('sensor')) {
      this.scope.set(DashboardScope.Sensor);
      this.scopeValue.set(this.activatedRoute.snapshot.paramMap.get('sensorId'));
    }
  }
}
