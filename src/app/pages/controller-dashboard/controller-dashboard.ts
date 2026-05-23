import { CommonModule } from '@angular/common';
import { ControllerCard } from '../../components/controller-card/controller-card';
import { Component, inject, OnInit, signal } from '@angular/core';
import { finalize } from 'rxjs';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { DashboardController } from '../../models/dashboard-controller';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardSensor } from '../../models/dashboard-sensor';

@Component({
  selector: 'app-controller-dashboard',
  imports: [CommonModule, ControllerCard],
  templateUrl: './controller-dashboard.html',
  styleUrl: './controller-dashboard.scss'
})
export class ControllerDashboard implements OnInit {
  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);

  protected readonly controllers = signal<DashboardController[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMeasurements();
  }

  protected loadMeasurements(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardMeasurementsService.getMeasurements()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: measurements => this.controllers.set(this.groupMeasurements(measurements)),
        error: () => this.errorMessage.set('Unable to load dashboard measurements.')
      });
  }

  protected getMeasurement(sensor: DashboardSensor, measurementType: string): DashboardMeasurement | undefined {
    return sensor.measurements.find(measurement => measurement.measurementType === measurementType);
  }

  protected getLastUpdatedUtc(controller: DashboardController): string | null {
    const timestamps = controller.sensors
      .flatMap(sensor => sensor.measurements)
      .map(measurement => measurement.createdUtc)
      .filter(Boolean)
      .sort((a, b) => new Date(b).getTime() - new Date(a).getTime());

    return timestamps[0] ?? null;
  }

  private groupMeasurements(measurements: DashboardMeasurement[]): DashboardController[] {
    const controllerMap = new Map<number, DashboardController>();

    for (const measurement of measurements) {
      let controller = controllerMap.get(measurement.controllerId);

      if (!controller) {
        controller = {
          controllerId: measurement.controllerId,
          controllerKey: measurement.controllerKey,
          controllerName: measurement.controllerName,
          location: measurement.location,
          sensors: []
        };

        controllerMap.set(measurement.controllerId, controller);
      }

      let sensor = controller.sensors.find(existingSensor => existingSensor.sensorId === measurement.sensorId);

      if (!sensor) {
        sensor = {
          sensorId: measurement.sensorId,
          sensorKey: measurement.sensorKey,
          sensorName: measurement.sensorName,
          sensorType: measurement.sensorType,
          measurements: []
        };

        controller.sensors.push(sensor);
      }

      const existingMeasurementIndex = sensor.measurements.findIndex(
        existingMeasurement => existingMeasurement.measurementType === measurement.measurementType
      );

      if (existingMeasurementIndex === -1) {
        sensor.measurements.push(measurement);
        continue;
      }

      const existingMeasurement = sensor.measurements[existingMeasurementIndex];
      const existingTime = new Date(existingMeasurement.createdUtc).getTime();
      const nextTime = new Date(measurement.createdUtc).getTime();

      if (nextTime > existingTime) {
        sensor.measurements[existingMeasurementIndex] = measurement;
      }
    }

    return Array.from(controllerMap.values());
  }
}
