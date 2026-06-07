import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { forkJoin, Observable } from 'rxjs';
import { ControllerDetailsHeader } from '../../components/controller-details-header/controller-details-header';
import { OverviewCard } from '../../components/overview-card/overview-card';

import { Controller } from '../../models/controller';
import { DashboardLocation } from '../../models/dashboard-location';
import { Overview } from '../../models/overview';
import { Sensor } from '../../models/sensor';
import { DeviceAdminService } from '../../services/device-admin.service';
import { DeviceCreateDialogComponent } from '../../shared/dialogs/device-create-dialog/device-create-dialog';
import { ConnectedSensors } from '../../components/connected-sensors/connected-sensors';

@Component({
  selector: 'app-controller-details',
  standalone: true,
  imports: [CommonModule, ControllerDetailsHeader, OverviewCard, ConnectedSensors],
  templateUrl: './controller-details.html',
  styleUrls: ['./controller-details.scss'],
})
export class ControllerDetails implements OnInit {
  protected readonly isLoading = signal(false);
  protected readonly isSensorsLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  controller: Controller | null = null;
  overviewCards: Overview[] = [];
  sensors: Sensor[] = [];

  private readonly deviceAdminService = inject(DeviceAdminService);
  private readonly dialog = inject(MatDialog);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  ngOnInit(): void {
    const controllerId = this.getControllerIdFromUrl();

    if (controllerId === null) {
      this.errorMessage.set('Unable to determine controller ID from URL.');
      return;
    }

    this.getControllerDetails(controllerId);
    this.getSensors(controllerId);
  }

  protected getCurrentUrl(): string {
    return this.router.url;
  }

  private getControllerIdFromUrl(): number | null {
    const rawControllerId = this.route.snapshot.paramMap.get('controllerId');

    if (!rawControllerId) {
      return null;
    }

    const controllerId = Number(rawControllerId);

    return Number.isFinite(controllerId) && controllerId > 0 ? controllerId : null;
  }

  protected getControllerDetails(controllerId: number): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.deviceAdminService.getControllerDetails(controllerId).subscribe({
      next: (controller) => {
        this.controller = controller;
        this.buildOverviewCards();
        this.isLoading.set(false);
      },

      error: () => {
        this.errorMessage.set('Unable to load controller details.');
        this.isLoading.set(false);
      },
    });
  }

  protected getSensors(controllerId: number): void {
    this.isSensorsLoading.set(true);

    this.deviceAdminService.getSensors(controllerId).subscribe({
      next: (sensors) => {
        console.log('sensors', sensors, sensors.length);
        this.sensors = sensors;
        this.isSensorsLoading.set(false);
      },
      error: () => {
        console.error('Unable to load connected sensors.');
        this.isSensorsLoading.set(false);
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
              selectedControllerId: this.controller?.id,
              selectedLocationName: this.controller?.location,
            },
            panelClass: 'device-create-dialog-panel',
            backdropClass: 'device-create-dialog-backdrop',
            autoFocus: false,
          })
          .afterClosed()
          .subscribe((result) => {
            if (result) {
              this.getSensors(this.getControllerIdFromUrl() ?? 0);
            }
          });
      },
    });
  }

  private buildOverviewCards(): void {
    if (!this.controller) {
      this.overviewCards = [];
      return;
    }

    this.overviewCards = [
      {
        icon: 'bi-geo-alt',
        label: 'Location',
        primaryText: this.controller.location ?? 'Unknown',
        secondaryText: this.controller.controllerKey,
        statusClass: 'status-success',
      },
      {
        icon: 'bi-broadcast',
        label: 'Sensors',
        primaryText: this.controller.sensorCount.toString(),
        secondaryText: 'Connected',
        statusClass: 'status-success',
      },
      {
        icon: 'bi-shield-check',
        label: 'Status',
        primaryText: this.controller.isActive ? 'Online' : 'Offline',
        secondaryText: '',
        statusClass: this.controller.isActive ? 'status-success' : 'status-danger',
      },
    ];
  }
}
