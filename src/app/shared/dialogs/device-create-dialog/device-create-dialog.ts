import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { DeviceAdminService } from '../../../services/device-admin.service';
import { DashboardController } from '../../../models/dashboard-controller';
import { ReactiveFormsModule } from '@angular/forms';

export type DeviceCreateDialogMode = 'controller' | 'sensor';

export class DeviceCreateDialogData {
  mode!: DeviceCreateDialogMode;
  location?: string;
  controllerId?: number;
  controllers?: DashboardController[];
}

@Component({
  selector: 'app-device-create-dialog',
  imports: [ReactiveFormsModule],
  templateUrl: './device-create-dialog.html',
  styleUrl: './device-create-dialog.scss',
})
export class DeviceCreateDialogComponent {
  isSaving = false;

  controllerForm: FormGroup;
  sensorForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DeviceCreateDialogComponent>,
    private readonly deviceAdminService: DeviceAdminService,

    @Inject(MAT_DIALOG_DATA) public readonly data: DeviceCreateDialogData,
  ) {
    this.controllerForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: [this.data.location ?? '', Validators.required],
      description: [''],
      controllerType: ['ESP32', Validators.required],
      ipAddress: [''],
      deviceIdentifier: [''],
      pollIntervalSeconds: [60],
      status: [true],
      notes: [''],
    });

    const defaultControllerId =
      this.data.controllerId ??
      (this.data.controllers?.length === 1 ? this.data.controllers[0].controllerId : null);

    this.sensorForm = this.formBuilder.group({
      name: ['', Validators.required],
      sensorType: ['SHT35', Validators.required],
      description: [''],
      status: [true],
      controllerId: [defaultControllerId, Validators.required],
      location: [this.data.location ?? '', Validators.required],
      deviceIdentifier: ['', Validators.required],
      i2cAddress: ['0x44'],
      measurementIntervalSeconds: [60],
      temperatureUnit: ['°C'],
      humidityUnit: ['%'],
      notes: [''],
    });
  }

  get isControllerMode(): boolean {
    return this.data.mode === 'controller';
  }

  get title(): string {
    return this.isControllerMode ? 'Create Controller' : 'Create Sensor';
  }

  get subtitle(): string {
    return this.isControllerMode
      ? 'Add a new controller for this location'
      : 'Add a new sensor and connect it to a controller';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    const form = this.isControllerMode ? this.controllerForm : this.sensorForm;

    if (form.invalid) {
      form.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    const request = this.isControllerMode
      ? this.deviceAdminService.createController(this.controllerForm.getRawValue())
      : this.deviceAdminService.createSensor(this.sensorForm.getRawValue());

    request.subscribe({
      next: (result) => {
        this.dialogRef.close(result);
      },
      error: () => {
        this.isSaving = false;
      },
    });
  }
}
