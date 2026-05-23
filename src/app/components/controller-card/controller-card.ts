import { DatePipe } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { AngularMaterialModules } from '../../shared/material/angular-material';
import { DashboardController } from '../../models/dashboard-controller';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardSensor } from '../../models/dashboard-sensor';

@Component({
  selector: 'app-controller-card',
  imports: [DatePipe, AngularMaterialModules],
  templateUrl: './controller-card.html',
  styleUrl: './controller-card.scss'
})
export class ControllerCard {
  readonly controller = input.required<DashboardController>();

  protected readonly primarySensor = computed(() => this.controller().sensors[0] ?? null);

  protected readonly primarySensorName = computed(() => this.primarySensor()?.sensorName ?? 'No sensor found');

  protected readonly primarySensorType = computed(() => this.formatSensorType(this.primarySensor()));

  protected readonly humidityMeasurement = computed(() => this.getMeasurementByType('humidity'));

  protected readonly temperatureMeasurement = computed(() => this.getMeasurementByType('temperature'));

  protected readonly sensorCount = computed(() => this.controller().sensorCount);

  protected readonly lastUpdatedUtc = computed(() => this.controller().lastUpdatedUtc);

  private getMeasurementByType(measurementType: string): DashboardMeasurement | null {
    return this.primarySensor()?.measurements.find(
      measurement => measurement.measurementType.toLowerCase() === measurementType
    ) ?? null;
  }

  private formatSensorType(sensor: DashboardSensor | null): string {
    if (!sensor) {
      return 'No measurements available';
    }

    if (sensor.sensorType === 'TemperatureHumidity') {
      return 'Temperature / Humidity';
    }

    return sensor.sensorType;
  }
}
