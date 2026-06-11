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
  @Input() isLoading = false;

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
    const hardwareModel = sensor.hardwareModel?.toLowerCase() ?? '';

    if (
      hardwareModel.includes('sht') ||
      hardwareModel.includes('dht') ||
      hardwareModel.includes('bme')
    ) {
      return 'sensor-icon--environment';
    }

    if (hardwareModel.includes('soil')) {
      return 'sensor-icon--soil';
    }

    if (hardwareModel.includes('ds18b20')) {
      return 'sensor-icon--temperature';
    }

    return 'sensor-icon--default';
  }

  protected getSensorIcon(sensor: Sensor): string {
    const hardwareModel = sensor.hardwareModel?.toLowerCase() ?? '';

    if (
      hardwareModel.includes('sht') ||
      hardwareModel.includes('dht') ||
      hardwareModel.includes('bme')
    ) {
      return 'bi-cloud-sun';
    }

    if (hardwareModel.includes('soil')) {
      return 'bi-flower1';
    }

    if (hardwareModel.includes('ds18b20')) {
      return 'bi-thermometer-half';
    }

    return 'bi-cpu';
  }

  protected getConnectionLabel(sensor: Sensor): string {
    const protocol = sensor.communicationProtocol?.trim();
    const address = sensor.address?.trim();

    if (protocol && address) {
      return `${protocol} - ${address}`;
    }

    if (protocol) {
      return protocol;
    }

    if (address) {
      return address;
    }

    return 'Unknown connection';
  }

  protected getLocationLabel(sensor: Sensor): string {
    return sensor.locationName || 'Unassigned location';
  }

  protected trackBySensorId(index: number, sensor: Sensor): number {
    return sensor.id;
  }
}
