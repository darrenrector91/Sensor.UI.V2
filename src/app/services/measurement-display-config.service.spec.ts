import { TestBed } from '@angular/core/testing';
import { MeasurementDisplayKind } from '../enums/measurement-display-kind';
import { MeasurementDisplayConfigService } from './measurement-display-config.service';

describe('MeasurementDisplayConfigService', () => {
  let service: MeasurementDisplayConfigService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MeasurementDisplayConfigService);
  });

  it('should return temperature display configuration', () => {
    const config = service.getConfig('Temperature');

    expect(config.measurementType).toBe('Temperature');
    expect(config.label).toBe('Temperature');
    expect(config.icon).toBe('thermostat');
    expect(config.displayKind).toBe(MeasurementDisplayKind.LineChart);
    expect(config.priority).toBe(10);
    expect(config.cssClass).toBe('metric-card--temperature');
    expect(config.accentColor).toBe('#d8e534');
    expect(config.defaultUnit).toBe('C');
  });

  it('should return humidity display configuration', () => {
    const config = service.getConfig('Humidity');

    expect(config.measurementType).toBe('Humidity');
    expect(config.label).toBe('Humidity');
    expect(config.icon).toBe('humidity_percentage');
    expect(config.displayKind).toBe(MeasurementDisplayKind.LineChart);
    expect(config.priority).toBe(20);
    expect(config.cssClass).toBe('metric-card--humidity');
    expect(config.accentColor).toBe('#58efc3');
    expect(config.defaultUnit).toBe('%');
  });

  it('should normalize spacing and casing for measurement lookup', () => {
    const config = service.getConfig('soil moisture');

    expect(config.measurementType).toBe('SoilMoisture');
    expect(config.label).toBe('Soil Moisture');
    expect(config.icon).toBe('water_drop');
    expect(config.displayKind).toBe(MeasurementDisplayKind.Gauge);
    expect(config.cssClass).toBe('metric-card--soil-moisture');
    expect(config.accentColor).toBe('#56bcff');
  });

  it('should return fallback configuration for unknown measurements', () => {
    const config = service.getConfig('CO2Level');

    expect(config.measurementType).toBe('CO2Level');
    expect(config.label).toBe('CO2Level');
    expect(config.icon).toBe('monitoring');
    expect(config.displayKind).toBe(MeasurementDisplayKind.ValueCard);
    expect(config.priority).toBe(999);
    expect(config.cssClass).toBe('metric-card--default');
    expect(config.accentColor).toBe('#9fc9ff');
  });
});
