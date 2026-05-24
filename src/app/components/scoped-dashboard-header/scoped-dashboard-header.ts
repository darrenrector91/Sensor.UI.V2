import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-scoped-dashboard-header',
  imports: [DatePipe, RouterLink],
  templateUrl: './scoped-dashboard-header.html',
  styleUrl: './scoped-dashboard-header.scss'
})
export class ScopedDashboardHeader {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly latestUpdatedUtc = input<string | null>(null);
  readonly isLoading = input(false);

  readonly refreshRequested = output<void>();

  protected refresh(): void {
    this.refreshRequested.emit();
  }
}
