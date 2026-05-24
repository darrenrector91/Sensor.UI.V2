import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ScopedTimeRangeSelector } from './scoped-time-range-selector';

describe('ScopedTimeRangeSelector', () => {
  let component: ScopedTimeRangeSelector;
  let fixture: ComponentFixture<ScopedTimeRangeSelector>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedTimeRangeSelector]
    }).compileComponents();

    fixture = TestBed.createComponent(ScopedTimeRangeSelector);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render time range options', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('6H');
    expect(compiled.textContent).toContain('24H');
    expect(compiled.textContent).toContain('7D');
    expect(compiled.textContent).toContain('30D');
  });

  it('should emit selected range', () => {
    spyOn(component.rangeSelected, 'emit');

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(component.rangeSelected.emit).toHaveBeenCalledWith('6H');
  });
});
