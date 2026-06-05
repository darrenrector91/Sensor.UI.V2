import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Controller } from '../../models/controller';
import { AngularMaterialModules } from '../../shared/angular-material';

@Component({
  selector: 'app-controller-card',
  imports: [RouterLink, AngularMaterialModules],
  templateUrl: './controller-card.html',
  styleUrl: './controller-card.scss',
})
export class ControllerCard {
  readonly controller = input.required<Controller>();
}
