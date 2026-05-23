import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { DashboardScope } from '../../enums/dashboard-scope';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';

@Component({
  selector: 'app-scoped-dashboard',
  imports: [CommonModule, RouterLink],
  templateUrl: './scoped-dashboard.html',
  styleUrl: './scoped-dashboard.scss'
})
export class ScopedDashboard implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);

  protected readonly measurements = signal<DashboardMeasurement[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  protected readonly scope = signal<DashboardScope | null>(null);
  protected readonly scopeValue = signal<string | null>(null);

  protected readonly title = computed(() => {
    const scope = this.scope();
    const scopeValue = this.scopeValue();

    if (!scope || !scopeValue) {
      return 'Dashboard';
    }

    switch (scope) {
      case DashboardScope.Controller:
        return `Controller ${scopeValue}`;

      case DashboardScope.Location:
        return `${scopeValue} Location`;

      case DashboardScope.Sensor:
        return `Sensor ${scopeValue}`;
    }
  });

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

  protected readonly groupedSensors = computed(() => {
    const sensorMap = new Map<number, DashboardMeasurement[]>();

    for (const measurement of this.filteredMeasurements()) {
      const existingMeasurements = sensorMap.get(measurement.sensorId) ?? [];
      existingMeasurements.push(measurement);
      sensorMap.set(measurement.sensorId, existingMeasurements);
    }

    return Array.from(sensorMap.entries()).map(([sensorId, measurements]) => ({
      sensorId,
      sensorName: measurements[0]?.sensorName ?? `Sensor ${sensorId}`,
      sensorKey: measurements[0]?.sensorKey ?? '',
      sensorType: measurements[0]?.sensorType ?? '',
      measurements: measurements.sort(
        (first, second) => new Date(second.createdUtc).getTime() - new Date(first.createdUtc).getTime()
      )
    }));
  });

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
