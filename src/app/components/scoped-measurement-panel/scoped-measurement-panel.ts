import { Component, inject, input } from '@angular/core';
import { MeasurementDisplayKind } from '../../enums/measurement-display-kind';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { MeasurementDisplayValue } from '../../models/measurement-display-value';
import { ScopedMeasurementGroup } from '../../models/scoped-measurement-group';
import { ScopedMeasurementStatistics } from '../../models/scoped-measurement-statistics';
import { ScopedSensorGroup } from '../../models/scoped-sensor-group';
import { MeasurementDisplayConfigService } from '../../services/measurement-display-config.service';
import { MeasurementDisplayValueService } from '../../services/measurement-display-value.service';
import { MeasurementLineChart } from '../measurement-line-chart/measurement-line-chart';

@Component({
  selector: 'app-scoped-measurement-panel',
  standalone: true,
  imports: [MeasurementLineChart],
  templateUrl: './scoped-measurement-panel.html',
  styleUrls: ['./scoped-measurement-panel.scss'],
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
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).accentColor;
  }

  protected getMeasurementDisplayKind(measurement: DashboardMeasurement): MeasurementDisplayKind {
    return this.measurementDisplayConfigService.getConfig(measurement.measurementType).displayKind;
  }

  protected getLatestMeasurement(group: ScopedMeasurementGroup): DashboardMeasurement | null {
    return group.measurements[0] ?? null;
  }

  protected getHistoryRangeLabel(group: ScopedMeasurementGroup): string {
    if (group.measurements.length === 0) {
      return 'No readings';
    }

    const sortedMeasurements = [...group.measurements].sort(
      (first, second) =>
        new Date(first.createdUtc).getTime() - new Date(second.createdUtc).getTime(),
    );

    const firstReading = sortedMeasurements[0];
    const lastReading = sortedMeasurements[sortedMeasurements.length - 1];

    if (!firstReading || !lastReading || firstReading.createdUtc === lastReading.createdUtc) {
      return 'Single reading';
    }

    return `${this.formatShortDate(firstReading.createdUtc)} – ${this.formatShortDate(lastReading.createdUtc)}`;
  }

  private formatShortDate(createdUtc: string): string {
    return new Date(createdUtc).toLocaleString([], {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  protected getMeasurementDisplayValue(measurement: DashboardMeasurement): MeasurementDisplayValue {
    const config = this.measurementDisplayConfigService.getConfig(measurement.measurementType);

    return this.measurementDisplayValueService.getMeasurementDisplayValue(
      measurement,
      config.defaultUnit ?? '',
    );
  }

  protected getStatistics(group: ScopedMeasurementGroup): ScopedMeasurementStatistics | null {
    const numericMeasurements = group.measurements
      .map((measurement) => ({
        measurement,
        numericValue: Number(measurement.value),
      }))
      .filter((item) => !Number.isNaN(item.numericValue));

    if (numericMeasurements.length === 0) {
      return null;
    }

    const minimum = numericMeasurements.reduce((lowest, current) =>
      current.numericValue < lowest.numericValue ? current : lowest,
    );

    const maximum = numericMeasurements.reduce((highest, current) =>
      current.numericValue > highest.numericValue ? current : highest,
    );

    const averageValue =
      numericMeasurements.reduce((total, item) => total + item.numericValue, 0) /
      numericMeasurements.length;

    const averageMeasurement = new DashboardMeasurement(
      minimum.measurement.controllerId,
      minimum.measurement.controllerKey,
      minimum.measurement.controllerName,
      minimum.measurement.location,
      minimum.measurement.sensorId,
      minimum.measurement.sensorName,
      minimum.measurement.sensorType,
      minimum.measurement.measurementType,
      averageValue.toString(),
      minimum.measurement.unit,
      minimum.measurement.createdUtc,
    );

    return new ScopedMeasurementStatistics(
      this.getMeasurementDisplayValue(minimum.measurement),
      this.getMeasurementDisplayValue(maximum.measurement),
      this.getMeasurementDisplayValue(averageMeasurement),
      numericMeasurements.length,
    );
  }
}
