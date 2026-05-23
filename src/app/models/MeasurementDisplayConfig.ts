import { MeasurementDisplayKind } from '../enums/measurement-display-kind';

export class MeasurementDisplayConfig {
  constructor(
    public measurementType: string,
    public label: string,
    public icon: string,
    public displayKind: MeasurementDisplayKind,
    public priority: number,
    public cssClass: string,
    public defaultUnit?: string,
  ) {}
}
