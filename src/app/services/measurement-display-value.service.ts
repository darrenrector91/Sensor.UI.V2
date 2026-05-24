import { Injectable } from '@angular/core';
import { ControllerCardMetric } from '../models/controller-card-metric';
import { DashboardMeasurement } from '../models/dashboard-measurement';
import { MeasurementDisplayValue } from '../models/measurement-display-value';

@Injectable({
  providedIn: 'root'
})
export class MeasurementDisplayValueService {
  getDisplayValue(metric: ControllerCardMetric): MeasurementDisplayValue {
    if (metric.measurement.measurementType.toLowerCase() === 'temperature') {
      return this.getTemperatureDisplayValue(metric.measurement);
    }

    return new MeasurementDisplayValue(
      this.formatNumericDisplayValue(metric.measurement.value),
      metric.measurement.unit || metric.config.defaultUnit || ''
    );
  }

  getMeasurementDisplayValue(measurement: DashboardMeasurement, defaultUnit = ''): MeasurementDisplayValue {
    if (measurement.measurementType.toLowerCase() === 'temperature') {
      return this.getTemperatureDisplayValue(measurement);
    }

    return new MeasurementDisplayValue(
      this.formatNumericDisplayValue(measurement.value),
      measurement.unit || defaultUnit
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
      '°F'
    );
  }

  private formatTemperature(value: number): string {
    return value.toFixed(1);
  }

  private formatNumericDisplayValue(value: string): string {
    const numericValue = Number(value);

    if (Number.isNaN(numericValue)) {
      return value;
    }

    return new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 1
    }).format(numericValue);
  }
}
