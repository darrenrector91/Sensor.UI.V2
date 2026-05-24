import { Injectable } from '@angular/core';
import { MeasurementDisplayKind } from '../enums/measurement-display-kind';
import { MeasurementDisplayConfig } from '../models/measurement-display-config';

@Injectable({
  providedIn: 'root'
})
export class MeasurementDisplayConfigService {
  private readonly fallbackConfig = new MeasurementDisplayConfig(
    'Unknown',
    'Measurement',
    'monitoring',
    MeasurementDisplayKind.ValueCard,
    999,
    'metric-card--default',
    '#9fc9ff'
  );

  private readonly configs = new Map<string, MeasurementDisplayConfig>([
    [
      'temperature',
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
    ],
    [
      'humidity',
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
    ],
    [
      'soilmoisture',
      new MeasurementDisplayConfig(
        'SoilMoisture',
        'Soil Moisture',
        'water_drop',
        MeasurementDisplayKind.Gauge,
        30,
        'metric-card--soil-moisture',
        '#56bcff',
        '%'
      )
    ],
    [
      'light',
      new MeasurementDisplayConfig(
        'Light',
        'Light',
        'wb_sunny',
        MeasurementDisplayKind.LineChart,
        40,
        'metric-card--light',
        '#ffd757',
        'lux'
      )
    ],
    [
      'batteryvoltage',
      new MeasurementDisplayConfig(
        'BatteryVoltage',
        'Battery',
        'battery_full',
        MeasurementDisplayKind.ValueCard,
        50,
        'metric-card--battery',
        '#71ff88',
        'V'
      )
    ],
    [
      'pumpstate',
      new MeasurementDisplayConfig(
        'PumpState',
        'Pump',
        'water_pump',
        MeasurementDisplayKind.Status,
        60,
        'metric-card--pump',
        '#48d7ff'
      )
    ],
    [
      'dooropen',
      new MeasurementDisplayConfig(
        'DoorOpen',
        'Door',
        'door_open',
        MeasurementDisplayKind.Status,
        70,
        'metric-card--door',
        '#ffa752'
      )
    ],
    [
      'waterlevel',
      new MeasurementDisplayConfig(
        'WaterLevel',
        'Water Level',
        'water',
        MeasurementDisplayKind.Gauge,
        80,
        'metric-card--water-level',
        '#48a4ff',
        '%'
      )
    ],
    [
      'signalstrength',
      new MeasurementDisplayConfig(
        'SignalStrength',
        'Signal',
        'network_wifi',
        MeasurementDisplayKind.ValueCard,
        90,
        'metric-card--signal',
        '#bea4ff',
        'dBm'
      )
    ]
  ]);

  getConfig(measurementType: string): MeasurementDisplayConfig {
    return this.configs.get(this.normalizeMeasurementType(measurementType)) ?? this.getFallbackConfig(measurementType);
  }

  private getFallbackConfig(measurementType: string): MeasurementDisplayConfig {
    return new MeasurementDisplayConfig(
      measurementType,
      this.formatMeasurementType(measurementType),
      this.fallbackConfig.icon,
      this.fallbackConfig.displayKind,
      this.fallbackConfig.priority,
      this.fallbackConfig.cssClass,
      this.fallbackConfig.accentColor
    );
  }

  private normalizeMeasurementType(measurementType: string): string {
    return measurementType.replace(/\s+/g, '').toLowerCase();
  }

  private formatMeasurementType(measurementType: string): string {
    return measurementType
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .replace(/[_-]+/g, ' ')
      .trim();
  }
}
