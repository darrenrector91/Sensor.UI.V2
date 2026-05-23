import { DashboardSensor } from './dashboard-sensor';

export interface DashboardController {
  controllerId: number;
  controllerKey: string;
  controllerName: string;
  location: string;
  sensors: DashboardSensor[];
}
