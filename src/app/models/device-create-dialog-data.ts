import { DeviceCreateDialogMode } from '../shared/dialogs/device-create-dialog/device-create-dialog';
import { DashboardController } from './dashboard-controller';
import { DashboardLocation } from './dashboard-location';

export class DeviceCreateDialogData {
  mode!: DeviceCreateDialogMode;
  selectedLocationName?: string;
  selectedControllerId?: number;
  availableControllers?: DashboardController[];
  availableLocations?: DashboardLocation[];
}
