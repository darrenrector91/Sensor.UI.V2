import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { MeasurementDisplayKind } from '../../enums/measurement-display-kind';
import { ScopedSensorGroup } from '../../models/scoped-sensor-group';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { MeasurementDisplayValue } from '../../models/measurement-display-value';
import { ScopedMeasurementGroup } from '../../models/scoped-measurement-group';
import { ScopedMeasurementStatistics } from '../../models/scoped-measurement-statistics';
import { MeasurementLineChart } from '../measurement-line-chart/measurement-line-chart';
import { MeasurementDisplayConfigService } from '../../services/measurement-display-config.service';
import { MeasurementDisplayValueService } from '../../services/measurement-display-value.service';

@Component({
  selector: 'app-scoped-measurement-panel',
  imports: [DatePipe, MeasurementLineChart],
  templateUrl: './scoped-measurement-panel.html',
  styleUrl: './scoped-measurement-panel.scss'
})
export class ScopedMeasurementPanel {
  readonly sensor = input.required<ScopedSensorGroup>();

  private readonly measurementDisplayConfigService = inject(MeasurementDisplayConfigService);
  private readonly measurementDisplayValueService = inject(MeasurementDisplayValueService);

  protected getMeasurementIcon(measurement: DashboardMeasurement): string {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).icon;
  }

  protected getMeasurementLabel(measurement: DashboardMeasurement): string {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).label;
  }

  protected getMeasurementCssClass(measurement: DashboardMeasurement): string {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).cssClass;
  }

  protected getMeasurementAccentColor(measurement: DashboardMeasurement): string {
    const cssClass = this.getMeasurementCssClass(measurement);

    switch (cssClass) {
      case 'metric-card--temperature':
        return '#d8e534';

      case 'metric-card--humidity':
        return '#58efc3';

      case 'metric-card--soil-moisture':
        return '#56bcff';

      case 'metric-card--light':
        return '#ffd757';

      case 'metric-card--battery':
        return '#71ff88';

      case 'metric-card--signal':
        return '#bea4ff';

      default:
        return '#9fc9ff';
    }
  }

  protected getMeasurementDisplayKind(measurement: DashboardMeasurement): MeasurementDisplayKind {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).displayKind;
  }

  protected getLatestMeasurement(group: ScopedMeasurementGroup): DashboardMeasurement | null {
    return group.measurements[0] ?? null;
  }

  protected getMeasurementDisplayValue(measurement: DashboardMeasurement): MeasurementDisplayValue {
    const config = this.measurementDisplayConfigService.getConfig(measurement.measurementType);

    return this.measurementDisplayValueService.getMeasurementDisplayValue(
      measurement,
      config.defaultUnit ?? ''
    );
  }

  protected getStatistics(group: ScopedMeasurementGroup): ScopedMeasurementStatistics | null {
    const numericValues = group.measurements
      .map(measurement => Number(measurement.value))
      .filter(value => !Number.isNaN(value));

    if (numericValues.length === 0) {
      return null;
    }

    const minimum = Math.min(...numericValues);
    const maximum = Math.max(...numericValues);
    const average = numericValues.reduce((total, value) => total + value, 0) / numericValues.length;

    return new ScopedMeasurementStatistics(
      this.formatStatistic(minimum),
      this.formatStatistic(maximum),
      this.formatStatistic(average),
      numericValues.length
    );
  }

  private formatStatistic(value: number): string {
    return value.toFixed(1);
  }
}
