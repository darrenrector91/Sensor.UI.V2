import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DashboardScope } from '../../enums/dashboard-scope';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { ScopedMeasurementGroup } from '../../models/scoped-measurement-group';
import { ScopedSensorGroup } from '../../models/scoped-sensor-group';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { MeasurementDisplayConfigService } from '../../services/measurement-display-config.service';
import { MeasurementDisplayValueService } from '../../services/measurement-display-value.service';
import { MeasurementDisplayValue } from '../../models/measurement-display-value';

@Component({
  selector: 'app-scoped-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './scoped-dashboard.html',
  styleUrl: './scoped-dashboard.scss'
})
export class ScopedDashboard implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);
  private readonly measurementDisplayConfigService = inject(MeasurementDisplayConfigService);
  private readonly measurementDisplayValueService = inject(MeasurementDisplayValueService);

  protected readonly measurements = signal<DashboardMeasurement[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly scope = signal<DashboardScope | null>(null);
  protected readonly scopeValue = signal<string | null>(null);

  protected readonly filteredMeasurements = computed(() => {
    const scope = this.scope();
    const scopeValue = this.scopeValue();

    if (!scope || !scopeValue) {
      return [];
    }

    return this.measurements().filter(measurement => {
      switch (scope) {
        case DashboardScope.Controller:
          return measurement.controllerId === Number(scopeValue);

        case DashboardScope.Location:
          return measurement.location.toLowerCase() === scopeValue.toLowerCase();

        case DashboardScope.Sensor:
          return measurement.sensorId === Number(scopeValue);
      }
    });
  });

  protected readonly latestMeasurements = computed(() => {
    const measurementMap = new Map<string, DashboardMeasurement>();

    for (const measurement of this.filteredMeasurements()) {
      const key = `${measurement.sensorId}-${measurement.measurementType}`;
      const existingMeasurement = measurementMap.get(key);

      if (
        !existingMeasurement ||
        new Date(measurement.createdUtc).getTime() > new Date(existingMeasurement.createdUtc).getTime()
      ) {
        measurementMap.set(key, measurement);
      }
    }

    return Array.from(measurementMap.values()).sort(
      (first, second) => first.measurementType.localeCompare(second.measurementType)
    );
  });

  protected readonly groupedSensors = computed(() => {
    const sensorMap = new Map<number, DashboardMeasurement[]>();

    for (const measurement of this.filteredMeasurements()) {
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

      const measurementGroups = Array.from(measurementTypeMap.entries())
        .map(([measurementType, groupedMeasurements]) =>
          new ScopedMeasurementGroup(
            measurementType,
            groupedMeasurements.sort(
              (first, second) => new Date(second.createdUtc).getTime() - new Date(first.createdUtc).getTime()
            )
          )
        )
        .sort((first, second) => first.measurementType.localeCompare(second.measurementType));

      return new ScopedSensorGroup(
        sensorId,
        measurements[0]?.sensorName ?? `Sensor ${sensorId}`,
        measurements[0]?.sensorKey ?? '',
        measurements[0]?.sensorType ?? '',
        measurementGroups
      );
    });
  });

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
          ? `${firstMeasurement.sensorKey} · ${firstMeasurement.sensorType}`
          : 'Sensor detail';
    }
  });

  protected readonly latestUpdatedUtc = computed(() => {
    const sortedMeasurements = [...this.filteredMeasurements()].sort(
      (first, second) => new Date(second.createdUtc).getTime() - new Date(first.createdUtc).getTime()
    );

    return sortedMeasurements[0]?.createdUtc ?? null;
  });

  protected getMeasurementIcon(measurement: DashboardMeasurement): string {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).icon;
  }

  protected getMeasurementLabel(measurement: DashboardMeasurement): string {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).label;
  }

  protected getMeasurementCssClass(measurement: DashboardMeasurement): string {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).cssClass;
  }

  protected getMeasurementDisplayValue(measurement: DashboardMeasurement): MeasurementDisplayValue {
    const config = this.measurementDisplayConfigService.getConfig(measurement.measurementType);

    return this.measurementDisplayValueService.getMeasurementDisplayValue(
      measurement,
      config.defaultUnit ?? ''
    );
  }

  ngOnInit(): void {
    this.setScopeFromRoute();
    this.loadMeasurements();
  }

  protected loadMeasurements(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardMeasurementsService.getMeasurements()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: measurements => this.measurements.set(measurements),
        error: () => this.errorMessage.set('Unable to load scoped dashboard measurements.')
      });
  }

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
