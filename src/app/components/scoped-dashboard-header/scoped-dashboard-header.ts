import { DatePipe } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  ScopedTimeRange,
  ScopedTimeRangeSelector,
} from '../scoped-time-range-selector/scoped-time-range-selector';

@Component({
  selector: 'app-scoped-dashboard-header',
  standalone: true,
  imports: [DatePipe, RouterLink, ScopedTimeRangeSelector],
  templateUrl: './scoped-dashboard-header.html',
  styleUrls: ['./scoped-dashboard-header.scss'],
})
export class ScopedDashboardHeader {
  readonly title = input.required<string>();
  readonly subtitle = input.required<string>();
  readonly latestUpdatedUtc = input<string | null>(null);
  readonly isLoading = input(false);
  readonly selectedTimeRange = input<ScopedTimeRange>('7D');

  readonly refreshRequested = output<void>();
  readonly timeRangeSelected = output<ScopedTimeRange>();

  protected refresh(): void {
    this.refreshRequested.emit();
  }

  protected selectTimeRange(range: ScopedTimeRange): void {
    this.timeRangeSelected.emit(range);
  }
}
