import { Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Controller } from '../../models/controller';
import { AngularMaterialModules } from '../../shared/angular-material';

@Component({
  selector: 'app-controller-card',
  standalone: true,
  imports: [RouterLink, AngularMaterialModules],
  templateUrl: './controller-card.html',
  styleUrls: ['./controller-card.scss'],
})
export class ControllerCard {
  readonly controller = input.required<Controller>();
}
