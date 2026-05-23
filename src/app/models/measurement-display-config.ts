import { MeasurementDisplayKind } from '../enums/measurement-display-kind';

export interface MeasurementDisplayConfig {
  label: string;
  icon: string;
  unit: string;
  displayKind: MeasurementDisplayKind;
  priority: number;
}
