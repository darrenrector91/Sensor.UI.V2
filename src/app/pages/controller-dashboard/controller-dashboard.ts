import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { finalize } from 'rxjs';
import { ControllerCard } from '../../components/controller-card/controller-card';
import { DashboardController } from '../../models/dashboard-controller';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardSensor } from '../../models/dashboard-sensor';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { DeviceCreateDialogComponent } from '../../shared/dialogs/device-create-dialog/device-create-dialog';
import { DashboardActionMenu } from '../../components/dashboard-action-menu/dashboard-action-menu';

@Component({
  selector: 'app-controller-dashboard',
  imports: [CommonModule, ControllerCard, DashboardActionMenu],
  templateUrl: './controller-dashboard.html',
  styleUrl: './controller-dashboard.scss',
})
export class ControllerDashboard implements OnInit {
  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);
  private readonly dialog = inject(MatDialog);

  protected readonly controllers = signal<DashboardController[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  ngOnInit(): void {
    this.loadMeasurements();
  }

  protected loadMeasurements(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.dashboardMeasurementsService
      .getMeasurements()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (measurements) => this.controllers.set(this.groupMeasurements(measurements)),
        error: () => this.errorMessage.set('Unable to load dashboard measurements.'),
      });
  }

  protected openCreateControllerDialog(): void {
    this.dialog
      .open(DeviceCreateDialogComponent, {
        data: {
          mode: 'controller',
          location: 'Garden',
        },
        panelClass: 'device-create-dialog-panel',
        backdropClass: 'device-create-dialog-backdrop',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadMeasurements();
        }
      });
  }

  protected openCreateSensorDialog(): void {
    this.dialog
      .open(DeviceCreateDialogComponent, {
        data: {
          mode: 'sensor',
          location: 'Garden',
        },
        panelClass: 'device-create-dialog-panel',
        backdropClass: 'device-create-dialog-backdrop',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.loadMeasurements();
        }
      });
  }

  private groupMeasurements(measurements: DashboardMeasurement[]): DashboardController[] {
    const controllerMap = new Map<number, DashboardController>();

    for (const measurement of measurements) {
      let controller = controllerMap.get(measurement.controllerId);

      if (!controller) {
        controller = new DashboardController(
          measurement.controllerId,
          measurement.controllerKey,
          measurement.controllerName,
          measurement.location,
          [],
        );

        controllerMap.set(measurement.controllerId, controller);
      }

      let sensor = controller.sensors.find(
        (currentSensor) => currentSensor.sensorId === measurement.sensorId,
      );

      if (!sensor) {
        sensor = new DashboardSensor(
          measurement.sensorId,
          measurement.sensorKey,
          measurement.sensorName,
          measurement.sensorType,
          [],
        );

        controller.sensors.push(sensor);
      }

      const existingMeasurementIndex = sensor.measurements.findIndex(
        (currentMeasurement) => currentMeasurement.measurementType === measurement.measurementType,
      );

      if (existingMeasurementIndex === -1) {
        sensor.measurements.push(measurement);
        continue;
      }

      const existingMeasurement = sensor.measurements[existingMeasurementIndex];

      if (
        new Date(measurement.createdUtc).getTime() >
        new Date(existingMeasurement.createdUtc).getTime()
      ) {
        sensor.measurements[existingMeasurementIndex] = measurement;
      }
    }

    return Array.from(controllerMap.values());
  }
}
