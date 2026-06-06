import { Routes } from '@angular/router';
import { AppShell } from './layout/app-shell/app-shell';
import { ControllerDashboard } from './pages/controller-dashboard/controller-dashboard';
import { ControllerDetails } from './pages/controller-details/controller-details';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    children: [
      {
        path: '',
        component: ControllerDashboard,
      },
      {
        path: 'dashboard/controller/:controllerId',
        component: ControllerDetails,
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
