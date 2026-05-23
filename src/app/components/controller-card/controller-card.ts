import { DatePipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularMaterialModules } from '../../shared/material/angular-material';
import { ControllerCardMetric } from '../../models/controller-card-metric';
import { DashboardController } from '../../models/dashboard-controller';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardSensor } from '../../models/dashboard-sensor';
import { MeasurementDisplayConfigService } from '../../services/measurement-display-config.service';
import { MeasurementDisplayValue } from '../../models/measurement-display-value';

@Component({
  selector: 'app-controller-card',
  imports: [DatePipe, RouterLink, AngularMaterialModules],
  templateUrl: './controller-card.html',
  styleUrl: './controller-card.scss',
})
export class ControllerCard {
  readonly controller = input.required<DashboardController>();

  private readonly measurementDisplayConfigService = inject(MeasurementDisplayConfigService);
  private readonly visibleMetricLimit = 4;

  protected readonly primarySensor = computed(() => this.controller().sensors[0] ?? null);

  protected readonly primarySensorName = computed(
    () => this.primarySensor()?.sensorName ?? 'No sensor found',
  );

  protected readonly primarySensorType = computed(() =>
    this.formatSensorType(this.primarySensor()),
  );

  protected readonly sensorCount = computed(() => this.controller().sensorCount);

  protected readonly lastUpdatedUtc = computed(() => this.controller().lastUpdatedUtc);

  protected readonly allMetrics = computed(
    () =>
      this.primarySensor()
        ?.measurements.map(
          (measurement) =>
            new ControllerCardMetric(
              measurement,
              this.measurementDisplayConfigService.getConfig(measurement.measurementType),
            ),
        )
        .sort((first, second) => first.config.priority - second.config.priority) ?? [],
  );

  protected readonly visibleMetrics = computed(() =>
    this.allMetrics().slice(0, this.visibleMetricLimit),
  );

  protected readonly hiddenMetricCount = computed(() =>
    Math.max(this.allMetrics().length - this.visibleMetricLimit, 0),
  );

  protected trackMetric(_: number, metric: ControllerCardMetric): string {
    return metric.measurement.measurementType;
  }

  protected getDisplayValue(metric: ControllerCardMetric): MeasurementDisplayValue {
    if (metric.measurement.measurementType.toLowerCase() === 'temperature') {
      return this.getTemperatureDisplayValue(metric.measurement);
    }

    return new MeasurementDisplayValue(
      metric.measurement.value,
      metric.measurement.unit || metric.config.defaultUnit || '',
    );
  }

  private getTemperatureDisplayValue(measurement: DashboardMeasurement): MeasurementDisplayValue {
    const celsius = Number(measurement.value);

    if (Number.isNaN(celsius)) {
      return new MeasurementDisplayValue(measurement.value, '°C');
    }

    const fahrenheit = (celsius * 9) / 5 + 32;

    return new MeasurementDisplayValue(
      this.formatTemperature(celsius),
      '°C',
      this.formatTemperature(fahrenheit),
      '°F',
    );
  }

  private formatTemperature(value: number): string {
    return value.toFixed(1);
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
