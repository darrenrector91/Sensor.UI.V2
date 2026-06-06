import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';

@Component({
  selector: 'app-controller-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './controller-details.html',
  styleUrls: ['./controller-details.scss'],
})
export class ControllerDetails implements OnInit {
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);
  ngOnInit(): void {}
  constructor() {}
}
