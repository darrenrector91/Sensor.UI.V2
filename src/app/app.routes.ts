import { Routes } from '@angular/router';
import { ControllerDashboard } from './pages/controller-dashboard/controller-dashboard';
import { ScopedDashboard } from './pages/scoped-dashboard/scoped-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: ControllerDashboard
  },
  {
    path: 'dashboard/controller/:controllerId',
    component: ScopedDashboard
  },
  {
    path: 'dashboard/location/:location',
    component: ScopedDashboard
  },
  {
    path: 'dashboard/sensor/:sensorId',
    component: ScopedDashboard
  },
  {
    path: '**',
    redirectTo: ''
  }
];
