import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { ControllerDetailsHeader } from '../../components/controller-details-header/controller-details-header';

@Component({
  selector: 'app-controller-details',
  standalone: true,
  imports: [CommonModule, ControllerDetailsHeader],
  templateUrl: './controller-details.html',
  styleUrls: ['./controller-details.scss'],
})
export class ControllerDetails implements OnInit {
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  ngOnInit(): void {}
  constructor() {}
}
