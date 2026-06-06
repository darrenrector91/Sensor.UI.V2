import { Component, EventEmitter, inject, Input, OnInit, Output, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardActionMenu } from '../../components/dashboard-action-menu/dashboard-action-menu';
import { Observable, forkJoin } from 'rxjs';
import { Controller } from '../../models/controller';
import { DashboardLocation } from '../../models/dashboard-location';
import { DeviceCreateDialogComponent } from '../../shared/dialogs/device-create-dialog/device-create-dialog';
import { CommonModule } from '@angular/common';
import { ControllerCard } from '../../components/controller-card/controller-card';
import { MatDialog } from '@angular/material/dialog';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { DeviceAdminService } from '../../services/device-admin.service';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterOutlet, DashboardActionMenu, CommonModule, DashboardActionMenu],
  templateUrl: './app-shell.html',
  styleUrls: ['./app-shell.scss'],
})
export class AppShell implements OnInit {
  @Output() createController = new EventEmitter<void>();
  @Output() createSensor = new EventEmitter<void>();
  @Output() createLocation = new EventEmitter<void>();
  @Input() kicker = '';

  private readonly dashboardMeasurementsService = inject(DashboardMeasurementsService);

  private readonly dialog = inject(MatDialog);

  protected readonly isAddMenuOpen = signal(false);

  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  private readonly deviceAdminService = inject(DeviceAdminService);

  ngOnInit(): void {}

  constructor() {}

  protected toggleAddMenu(): void {
    this.isAddMenuOpen.update((current) => !current);
  }

  protected onCreateController(): void {
    this.isAddMenuOpen.set(false);
    this.createController.emit();
  }

  protected onCreateSensor(): void {
    this.isAddMenuOpen.set(false);
    this.createSensor.emit();
  }

  protected onCreateLocation(): void {
    this.isAddMenuOpen.set(false);
    this.createLocation.emit();
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
        // if (result) {
        //   this.getControllers();
        // }
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
            // if (result) {
            //   this.getControllers();
            // }
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
            // if (result) {
            //   this.getControllers();
            // }
          });
      },
    });
  }
}
