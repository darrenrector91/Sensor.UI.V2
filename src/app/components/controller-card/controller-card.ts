import { CommonModule } from '@angular/common';
import { Component, computed, input } from '@angular/core';
import { DashboardController } from '../../models/dashboard-controller';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardSensor } from '../../models/dashboard-sensor';

@Component({
  selector: 'app-controller-card',
  imports: [CommonModule],
  templateUrl: './controller-card.html',
  styleUrl: './controller-card.scss'
})
export class ControllerCard {
  readonly controller = input.required<DashboardController>();

  protected readonly primarySensor = computed(() => this.controller().sensors[0] ?? null);

  protected readonly humidityMeasurement = computed(() => this.getMeasurementByType(this.primarySensor(), 'humidity'));

  protected readonly temperatureMeasurement = computed(() => this.getMeasurementByType(this.primarySensor(), 'temperature'));

  protected readonly lastUpdatedUtc = computed(() => {
    const measurements = this.controller().sensors.flatMap(sensor => sensor.measurements);

    if (measurements.length === 0) {
      return null;
    }

    return measurements.reduce((latest, current) =>
      new Date(current.createdUtc).getTime() > new Date(latest.createdUtc).getTime()
        ? current
        : latest
    ).createdUtc;
  });

  private getMeasurementByType(sensor: DashboardSensor | null, measurementType: string): DashboardMeasurement | null {
    return sensor?.measurements.find(
      measurement => measurement.measurementType.toLowerCase() === measurementType
    ) ?? null;
  }
}
