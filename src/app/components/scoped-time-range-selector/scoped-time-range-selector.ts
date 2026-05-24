import { Component, input, output } from '@angular/core';

export type ScopedTimeRange = '1H' | '6H' | '24H' | '7D' | '30D';

@Component({
  selector: 'app-scoped-time-range-selector',
  imports: [],
  templateUrl: './scoped-time-range-selector.html',
  styleUrl: './scoped-time-range-selector.scss'
})
export class ScopedTimeRangeSelector {
  readonly selectedRange = input<ScopedTimeRange>('24H');

  readonly rangeSelected = output<ScopedTimeRange>();

  protected readonly ranges: ScopedTimeRange[] = ['1H', '6H', '24H', '7D', '30D'];

  protected selectRange(range: ScopedTimeRange): void {
    this.rangeSelected.emit(range);
  }
}
