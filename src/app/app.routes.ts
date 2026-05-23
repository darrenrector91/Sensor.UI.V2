import { Routes } from '@angular/router';
import { ControllerDashboard } from './pages/controller-dashboard/controller-dashboard';

export const routes: Routes = [
  {
    path: '',
    component: ControllerDashboard
  },
  {
    path: '**',
    redirectTo: ''
  }
];
