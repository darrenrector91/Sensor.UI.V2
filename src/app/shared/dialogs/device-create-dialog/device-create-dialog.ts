import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { CreateLocationRequest } from '../../../models/createLocationRequest';
import { DashboardController } from '../../../models/dashboard-controller';
import { DeviceAdminService } from '../../../services/device-admin.service';
import { AngularMaterialModules } from '../../angular-material';

export type DeviceCreateDialogMode = 'controller' | 'sensor' | 'location';

export class DeviceCreateDialogData {
  mode!: DeviceCreateDialogMode;
  location?: string;
  controllerId?: number;
  controllers?: DashboardController[];
}

@Component({
  selector: 'app-device-create-dialog',
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModules],
  templateUrl: './device-create-dialog.html',
  styleUrl: './device-create-dialog.scss',
})
export class DeviceCreateDialogComponent {
  isSaving = false;

  locationForm: FormGroup;
  controllerForm: FormGroup;
  sensorForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DeviceCreateDialogComponent>,
    private readonly deviceAdminService: DeviceAdminService,
    @Inject(MAT_DIALOG_DATA) public readonly data: DeviceCreateDialogData,
  ) {
    this.locationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      latitude: [environment.location.latitude, Validators.required],
      longitude: [environment.location.longitude, Validators.required],
    });

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

  get isLocationMode(): boolean {
    return this.data.mode === 'location';
  }

  get title(): string {
    if (this.isControllerMode) {
      return 'Create Controller';
    }

    if (this.isLocationMode) {
      return 'Create Location';
    }

    return 'Create Sensor';
  }

  get subtitle(): string {
    if (this.isControllerMode) {
      return 'Add a new controller for this location';
    }

    if (this.isLocationMode) {
      return 'Add a new physical location for controllers and sensors';
    }

    return 'Add a new sensor and connect it to a controller';
  }

  get saveButtonText(): string {
    if (this.isControllerMode) {
      return 'Save Controller';
    }

    if (this.isLocationMode) {
      return 'Save Location';
    }

    return 'Save Sensor';
  }

  cancel(): void {
    this.dialogRef.close();
  }

  save(): void {
    if (this.isLocationMode) {
      this.saveLocation();
      return;
    }

    if (this.isControllerMode) {
      this.saveController();
      return;
    }

    this.saveSensor();
  }

  private saveLocation(): void {
    if (this.locationForm.invalid) {
      this.locationForm.markAllAsTouched();
      return;
    }

    const formValue = this.locationForm.getRawValue();

    const request: CreateLocationRequest = {
      name: formValue.name.trim(),
      description: formValue.description?.trim() || null,
      latitude: Number(formValue.latitude),
      longitude: Number(formValue.longitude),
    };

    this.isSaving = true;

    this.deviceAdminService.createLocation(request).subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (error) => {
        console.error('Failed to create location', error);
        this.isSaving = false;
      },
    });
  }

  private saveController(): void {
    if (this.controllerForm.invalid) {
      this.controllerForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.deviceAdminService.createController(this.controllerForm.getRawValue()).subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (error) => {
        console.error('Failed to create controller', error);
        this.isSaving = false;
      },
    });
  }

  private saveSensor(): void {
    if (this.sensorForm.invalid) {
      this.sensorForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;

    this.deviceAdminService.createSensor(this.sensorForm.getRawValue()).subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (error) => {
        console.error('Failed to create sensor', error);
        this.isSaving = false;
      },
    });
  }
}
