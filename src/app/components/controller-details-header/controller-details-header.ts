import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AngularMaterialModules } from '../../shared/angular-material';

@Component({
  selector: 'app-controller-details-header',
  imports: [AngularMaterialModules],
  templateUrl: './controller-details-header.html',
  styleUrl: './controller-details-header.scss',
})
export class ControllerDetailsHeader {}
