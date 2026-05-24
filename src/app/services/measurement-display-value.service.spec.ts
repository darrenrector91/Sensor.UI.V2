import { TestBed } from '@angular/core/testing';
import { MeasurementDisplayKind } from '../enums/measurement-display-kind';
import { ControllerCardMetric } from '../models/controller-card-metric';
import { DashboardMeasurement } from '../models/dashboard-measurement';
import { MeasurementDisplayConfig } from '../models/measurement-display-config';
import { MeasurementDisplayValueService } from './measurement-display-value.service';

describe('MeasurementDisplayValueService', () => {
  let service: MeasurementDisplayValueService;

  const temperatureMeasurement = new DashboardMeasurement(
    1,
    'greenhouse-01',
    'Greenhouse Controller',
    'Garden',
    1,
    'sht35-01',
    'SHT35 Sensor',
    'TemperatureHumidity',
    'Temperature',
    '20',
    'C',
    '2026-05-22T20:49:20.734983'
  );

  const humidityMeasurement = new DashboardMeasurement(
    1,
    'greenhouse-01',
    'Greenhouse Controller',
    'Garden',
    1,
    'sht35-01',
    'SHT35 Sensor',
    'TemperatureHumidity',
    'Humidity',
    '58.15',
    '%',
    '2026-05-22T20:49:21.01768'
  );

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementDisplayValueService);
  });

  it('should format Celsius temperature with Fahrenheit secondary value', () => {
    const metric = new ControllerCardMetric(
      temperatureMeasurement,
      new MeasurementDisplayConfig(
        'Temperature',
        'Temperature',
        'thermostat',
        MeasurementDisplayKind.LineChart,
        10,
        'metric-card--temperature',
        '#d8e534',
        'C'
      )
    );

    const value = service.getDisplayValue(metric);

    expect(value.primaryValue).toBe('20.0');
    expect(value.primaryUnit).toBe('°C');
    expect(value.secondaryValue).toBe('68.0');
    expect(value.secondaryUnit).toBe('°F');
  });

  it('should display non-temperature measurement with its provided unit', () => {
    const metric = new ControllerCardMetric(
      humidityMeasurement,
      new MeasurementDisplayConfig(
        'Humidity',
        'Humidity',
        'humidity_percentage',
        MeasurementDisplayKind.LineChart,
        20,
        'metric-card--humidity',
        '#58efc3',
        '%'
      )
    );

    const value = service.getDisplayValue(metric);

    expect(value.primaryValue).toBe('58.2');
    expect(value.primaryUnit).toBe('%');
    expect(value.secondaryValue).toBeUndefined();
    expect(value.secondaryUnit).toBeUndefined();
  });

  it('should use default unit when measurement unit is empty', () => {
    const measurement = new DashboardMeasurement(
      1,
      'greenhouse-01',
      'Greenhouse Controller',
      'Garden',
      1,
      'battery-01',
      'Battery Sensor',
      'Battery',
      'BatteryVoltage',
      '4.1',
      '',
      '2026-05-22T20:49:21.01768'
    );

    const value = service.getMeasurementDisplayValue(measurement, 'V');

    expect(value.primaryValue).toBe('4.1');
    expect(value.primaryUnit).toBe('V');
  });
});
