export class MeasurementDisplayValue {
  constructor(
    public primaryValue: string,
    public primaryUnit: string,
    public secondaryValue?: string,
    public secondaryUnit?: string
  ) {}
}
