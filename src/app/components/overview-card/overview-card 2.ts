import { Component, Input } from '@angular/core';
import { Overview } from '../../models/overview';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-overview-card',
  imports: [CommonModule],
  templateUrl: './overview-card.html',
  styleUrl: './overview-card.scss',
})
export class OverviewCard {
  @Input() card = new Overview();
}
