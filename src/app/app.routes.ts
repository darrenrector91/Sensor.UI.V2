import { Routes } from '@angular/router';
import { ControllerDashboard } from './pages/controller-dashboard/controller-dashboard';
import { ControllerDetails } from './pages/controller-details/controller-details';

export const routes: Routes = [
  {
    path: '',
    component: ControllerDashboard,
  },
  {
    path: 'dashboard/controller/:controllerId',
    component: ControllerDetails,
  },
  {
    path: '**',
    redirectTo: '',
  },
];
