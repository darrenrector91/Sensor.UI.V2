import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { environment } from '../../../../environments/environment';
import { DeviceAdminService } from '../../../services/device-admin.service';
import { AngularMaterialModules } from '../../angular-material';
import { DeviceCreateDialogData } from '../../../models/device-create-dialog-data';
import { CreateControllerRequest } from '../../../models/create-controller-request';
import { CreateLocationRequest } from '../../../models/create-location-request';
import { CreateSensorRequest } from '../../../models/create-sensor-request';

export type DeviceCreateDialogMode = 'controller' | 'sensor' | 'location';

type LocationOption = {
  id: number;
  name: string;
};

@Component({
  selector: 'app-device-create-dialog',
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModules],
  templateUrl: './device-create-dialog.html',
  styleUrl: './device-create-dialog.scss',
})
export class DeviceCreateDialogComponent {
  isSaving = false;

  locationOptions: LocationOption[] = [];

  locationForm: FormGroup;
  controllerForm: FormGroup;
  sensorForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DeviceCreateDialogComponent>,
    private readonly deviceAdminService: DeviceAdminService,
    @Inject(MAT_DIALOG_DATA) public readonly data: DeviceCreateDialogData,
  ) {
    this.locationOptions = (this.data.availableLocations ?? []).map((location: any) => ({
      id: Number(location.locationId ?? location.id),
      name: location.name,
    }));

    const defaultLocationId = this.data.selectedLocationName
      ? (this.locationOptions.find((location) => location.name === this.data.selectedLocationName)
          ?.id ?? null)
      : this.locationOptions.length === 1
        ? this.locationOptions[0].id
        : null;

    const defaultControllerId =
      this.data.selectedControllerId ??
      (this.data.availableControllers?.length === 1
        ? this.data.availableControllers[0].controllerId
        : null);

    this.locationForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      latitude: [environment.location.latitude, Validators.required],
      longitude: [environment.location.longitude, Validators.required],
    });

    this.controllerForm = this.formBuilder.group({
      name: ['', Validators.required],
      location: [defaultLocationId, Validators.required],
      description: [''],
      controllerType: ['ESP32', Validators.required],
      ipAddress: [''],
      controllerKey: ['', Validators.required],
      pollIntervalSeconds: [60],
      status: [true],
      notes: [''],
    });

    this.sensorForm = this.formBuilder.group({
      name: ['', Validators.required],
      sensorType: ['SHT35', Validators.required],
      description: [''],
      status: [true],
      controllerId: [defaultControllerId, Validators.required],
      location: [this.data.selectedLocationName ?? '', Validators.required],
      controllerKey: ['', Validators.required],
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

    const formValue = this.controllerForm.getRawValue();

    const request: CreateControllerRequest = {
      name: formValue.name.trim(),
      controllerKey: formValue.controllerKey.trim(),
      locationId: Number(formValue.location),
    };

    this.isSaving = true;

    this.deviceAdminService.createController(request).subscribe({
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

    const formValue = this.sensorForm.getRawValue();

    const request: CreateSensorRequest = {
      name: formValue.name.trim(),
      sensorType: formValue.sensorType,
      description: formValue.description?.trim() || null,
      status: Boolean(formValue.status),
      controllerId: Number(formValue.controllerId),
      location: formValue.location,
      controllerKey: formValue.controllerKey.trim(),
      i2cAddress: formValue.i2cAddress?.trim() || null,
      measurementIntervalSeconds: Number(formValue.measurementIntervalSeconds),
      temperatureUnit: formValue.temperatureUnit || null,
      humidityUnit: formValue.humidityUnit || null,
      notes: formValue.notes?.trim() || null,
    };

    this.isSaving = true;

    this.deviceAdminService.createSensor(request).subscribe({
      next: (result) => this.dialogRef.close(result),
      error: (error) => {
        console.error('Failed to create sensor', error);
        this.isSaving = false;
      },
    });
  }
}
