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
    'metric-card--default'
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
        'metric-card--pump'
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
        'metric-card--door'
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
      this.fallbackConfig.cssClass
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
