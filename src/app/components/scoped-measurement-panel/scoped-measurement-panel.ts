import { DatePipe } from '@angular/common';
import { Component, inject, input } from '@angular/core';
import { ScopedSensorGroup } from '../../models/scoped-sensor-group';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { MeasurementDisplayValue } from '../../models/measurement-display-value';
import { MeasurementDisplayConfigService } from '../../services/measurement-display-config.service';
import { MeasurementDisplayValueService } from '../../services/measurement-display-value.service';

@Component({
  selector: 'app-scoped-measurement-panel',
  imports: [DatePipe],
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

  protected getMeasurementDisplayValue(measurement: DashboardMeasurement): MeasurementDisplayValue {
    const config = this.measurementDisplayConfigService.getConfig(measurement.measurementType);

    return this.measurementDisplayValueService.getMeasurementDisplayValue(
      measurement,
      config.defaultUnit ?? ''
    );
  }
}
