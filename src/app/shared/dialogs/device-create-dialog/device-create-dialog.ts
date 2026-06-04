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
import { ControllerOption } from '../../../models/controllerOption';
import { LocationOption } from '../../../models/locationOption';

export type DeviceCreateDialogMode = 'controller' | 'sensor' | 'location';

@Component({
  selector: 'app-device-create-dialog',
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModules],
  templateUrl: './device-create-dialog.html',
  styleUrl: './device-create-dialog.scss',
})
export class DeviceCreateDialogComponent {
  isSaving = false;

  locationOptions: LocationOption[] = [];
  controllerOptions: ControllerOption[] = [];

  locationForm: FormGroup;
  controllerForm: FormGroup;
  sensorForm: FormGroup;

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly dialogRef: MatDialogRef<DeviceCreateDialogComponent>,
    private readonly deviceAdminService: DeviceAdminService,
    @Inject(MAT_DIALOG_DATA) public readonly data: DeviceCreateDialogData,
  ) {
    this.locationOptions = (this.data.availableLocations ?? [])
      .map((location: any) => ({
        id: Number(location.locationId ?? location.id),
        name: location.name,
      }))
      .filter((location) => Number.isFinite(location.id) && !!location.name);

    this.controllerOptions = (this.data.availableControllers ?? [])
      .map((controller: any) => {
        const option = new ControllerOption();

        option.id = Number(controller.controllerId ?? controller.id);
        option.name = controller.controllerName ?? controller.name;
        option.locationId = controller.locationId ?? null;
        option.location = controller.location ?? null;

        return option;
      })
      .filter((controller) => Number.isFinite(controller.id) && !!controller.name);

    const defaultLocationId = this.data.selectedLocationName
      ? (this.locationOptions.find((location) => location.name === this.data.selectedLocationName)
          ?.id ?? null)
      : this.locationOptions.length === 1
        ? this.locationOptions[0].id
        : null;

    const defaultControllerId =
      this.data.selectedControllerId ??
      (this.controllerOptions.length === 1 ? this.controllerOptions[0].id : null);

    const defaultController = this.controllerOptions.find(
      (controller) => controller.id === Number(defaultControllerId),
    );

    const defaultSensorLocationName =
      defaultController?.location ??
      this.data.selectedLocationName ??
      (this.locationOptions.length === 1 ? this.locationOptions[0].name : '');

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
      locationId: [defaultLocationId, Validators.required],
      location: [{ value: defaultSensorLocationName, disabled: true }, Validators.required],
      controllerKey: ['', Validators.required],
      i2cAddress: ['0x44'],
      measurementIntervalSeconds: [60],
      temperatureUnit: ['°C'],
      humidityUnit: ['%'],
      notes: [''],
    });

    this.sensorForm.get('controllerId')?.valueChanges.subscribe((controllerId) => {
      const controller = this.controllerOptions.find((item) => item.id === Number(controllerId));

      this.sensorForm.patchValue({
        location: controller?.location ?? '',
        locationId: controller?.locationId ?? null,
      });
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
    console.log('isLocationMode', this.isLocationMode);
    console.log('isControllerMode', this.isControllerMode);

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
    console.log('in saveSensor');
    console.log('invalid ?', this.sensorForm.invalid);

    console.log('sensorForm value', this.sensorForm.getRawValue());
    console.log('sensorForm errors', this.sensorForm.errors);

    Object.keys(this.sensorForm.controls).forEach((key) => {
      const control = this.sensorForm.get(key);

      console.log(key, {
        value: control?.value,
        valid: control?.valid,
        disabled: control?.disabled,
        errors: control?.errors,
      });
    });

    if (this.sensorForm.invalid) {
      this.sensorForm.markAllAsTouched();
      return;
    }

    const formValue = this.sensorForm.getRawValue();

    console.log('formValue', formValue);

    const request: CreateSensorRequest = {
      controllerId: Number(formValue.controllerId),
      locationId: Number(formValue.locationId),
      controllerKey: formValue.controllerKey.trim(),
      name: formValue.name.trim(),
      sensorType: formValue.sensorType,
      description: formValue.description?.trim() || null,
      status: Boolean(formValue.status),
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
