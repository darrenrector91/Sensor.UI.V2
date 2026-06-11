import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { Controller } from '../../models/controller';
import { DashboardLocation } from '../../models/dashboard-location';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { DeviceAdminService } from '../../services/device-admin.service';
import { DeviceCreateDialogComponent } from '../../shared/dialogs/device-create-dialog/device-create-dialog';
import { ControllerCard } from '../../components/controller-card/controller-card';
import { AngularMaterialModules } from '../../shared/angular-material';

@Component({
  selector: 'app-controller-dashboard',
  standalone: true,
  imports: [CommonModule, AngularMaterialModules, ControllerCard],
  templateUrl: './controller-dashboard.html',
  styleUrls: ['./controller-dashboard.scss'],
})
export class ControllerDashboard implements OnInit {
  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);
  private readonly dialog = inject(MatDialog);

  protected readonly controllers = signal<Controller[]>([]);
  // Keep the full list so we can filter without refetching
  private readonly allControllers = signal<Controller[]>([]);
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  isShowAllControllers: boolean = false;

  private readonly deviceAdminService = inject(DeviceAdminService);

  ngOnInit(): void {
    this.getControllers();
  }

  protected getControllers(): void {
    this.deviceAdminService.getControllers().subscribe({
      next: (controllers) => {
        const mapped = controllers.map((controller) => Object.assign(new Controller(), controller));
        this.allControllers.set(mapped);
        this.applyControllerFilter();
      },

      error: () => this.errorMessage.set('Unable to load controllers.'),
    });
  }

  protected openCreateLocationDialog(): void {
    this.dialog
      .open(DeviceCreateDialogComponent, {
        data: {
          mode: 'location',
        },
        panelClass: 'device-create-dialog-panel',
        backdropClass: 'device-create-dialog-backdrop',
        autoFocus: false,
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getControllers();
        }
      });
  }

  protected openCreateControllerDialog(): void {
    this.deviceAdminService.getLocations().subscribe({
      next: (locations) => {
        this.dialog
          .open(DeviceCreateDialogComponent, {
            data: {
              mode: 'controller',
              availableLocations: locations,
            },
            panelClass: 'device-create-dialog-panel',
            backdropClass: 'device-create-dialog-backdrop',
            autoFocus: false,
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.getControllers();
            }
          });
      },
    });
  }

  protected openCreateSensorDialog(): void {
    const _locations: Observable<DashboardLocation[]> = this.deviceAdminService.getLocations();
    const _controllers: Observable<Controller[]> = this.deviceAdminService.getControllers();
    forkJoin({
      locations: _locations,
      controllers: _controllers,
    }).subscribe({
      next: ({ locations, controllers }) => {
        this.dialog
          .open(DeviceCreateDialogComponent, {
            data: {
              mode: 'sensor',
              availableLocations: locations,
              availableControllers: controllers,
            },
            panelClass: 'device-create-dialog-panel',
            backdropClass: 'device-create-dialog-backdrop',
            autoFocus: false,
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.getControllers();
            }
          });
      },
    });
  }

  setControllerVisibility(event: boolean) {
    this.isShowAllControllers = event;
    this.applyControllerFilter();
  }

  private applyControllerFilter(): void {
    const list = this.allControllers();
    if (this.isShowAllControllers) {
      this.controllers.set(list);
      return;
    }

    this.controllers.set(list.filter((c) => c.hasSensors));
  }

  // private groupMeasurements(measurements: DashboardMeasurement[]): Controller[] {
  //   const controllerMap = new Map<number, Controller>();

  //   for (const measurement of measurements) {
  //     let controller = controllerMap.get(measurement.controllerId);

  //     if (!controller) {
  //       controller = new Controller(
  //         measurement.controllerId,
  //         measurement.controllerKey,
  //         measurement.controllerName,
  //         measurement.location,
  //         [],
  //       );

  //       controllerMap.set(measurement.controllerId, controller);
  //     }

  //     let sensor = controller.sensors.find(
  //       (currentSensor) => currentSensor.sensorId === measurement.sensorId,
  //     );

  //     if (!sensor) {
  //       sensor = new DashboardSensor(
  //         measurement.sensorId,
  //         measurement.controllerKey,
  //         measurement.sensorName,
  //         measurement.sensorType,
  //         [],
  //       );

  //       controller.sensors.push(sensor);
  //     }

  //     const existingMeasurementIndex = sensor.measurements.findIndex(
  //       (currentMeasurement) => currentMeasurement.measurementType === measurement.measurementType,
  //     );

  //     if (existingMeasurementIndex === -1) {
  //       sensor.measurements.push(measurement);
  //       continue;
  //     }

  //     const existingMeasurement = sensor.measurements[existingMeasurementIndex];

  //     if (
  //       new Date(measurement.createdUtc).getTime() >
  //       new Date(existingMeasurement.createdUtc).getTime()
  //     ) {
  //       sensor.measurements[existingMeasurementIndex] = measurement;
  //     }
  //   }

  //   return Array.from(controllerMap.values());
  // }
}
