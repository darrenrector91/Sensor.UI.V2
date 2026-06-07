import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SensorSearch } from '../sensor-search/sensor-search';
import { Sensor } from '../../models/sensor';

@Component({
  selector: 'app-connected-sensors',
  standalone: true,
  imports: [CommonModule, SensorSearch],
  templateUrl: './connected-sensors.html',
  styleUrls: ['./connected-sensors.scss'],
})
export class ConnectedSensors {
  @Output() createSensor = new EventEmitter<void>();
  @Input() sensors: Sensor[] = [];

  constructor() {
    console.log('child sensors', this.sensors);
  }

  protected onCreateSensor(): void {
    this.createSensor.emit();
  }

  protected formatDate(value: string): string {
    if (!value) {
      return 'Unknown';
    }

    const date = new Date(value);

    return date.toLocaleString([], {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }

  protected getStatusClass(sensor: Sensor): string {
    return sensor.isActive ? 'status-online' : 'status-offline';
  }

  protected getSensorIconClass(sensor: Sensor): string {
    const type = sensor.sensorType?.toLowerCase() ?? '';

    if (type.includes('temperature')) {
      return 'sensor-icon--temperature';
    }

    if (type.includes('humidity') || type.includes('soil')) {
      return 'sensor-icon--humidity';
    }

    return 'sensor-icon--default';
  }

  protected getSensorIcon(sensor: Sensor): string {
    const type = sensor.sensorType?.toLowerCase() ?? '';

    if (type.includes('temperature')) {
      return 'bi-thermometer-half';
    }

    if (type.includes('humidity')) {
      return 'bi-droplet';
    }

    if (type.includes('soil')) {
      return 'bi-leaf';
    }

    return 'bi-circle-half';
  }

  protected trackBySensorKey(index: number, sensor: Sensor): string {
    return sensor.sensorKey;
  }
}
