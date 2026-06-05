import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { ScopedHealthSummary } from './scoped-health-summary';

describe('ScopedHealthSummary', () => {
  let component: ScopedHealthSummary;
  let fixture: ComponentFixture<ScopedHealthSummary>;

  const measurements = [
    new DashboardMeasurement(
      1,
      'greenhouse-01',
      'Greenhouse Controller',
      'Garden',
      1,
      'sht35-01',
      'SHT35 Sensor',
      'Temperature',
      '20',
      'C',
      '2026-05-22T20:49:20.734983',
    ),
    new DashboardMeasurement(
      1,
      'greenhouse-01',
      'Greenhouse Controller',
      'Garden',
      1,
      'sht35-01',
      'SHT35 Sensor',
      'Humidity',
      '58',
      '%',
      '2026-05-22T20:49:21.01768',
    ),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedHealthSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ScopedHealthSummary);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('measurements', measurements);
    fixture.componentRef.setInput('latestUpdatedUtc', '2026-05-22T20:49:21.01768');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render health summary counts', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Stale');
    expect(compiled.textContent).toContain('Sensors');
    expect(compiled.textContent).toContain('Measurement Types');
    expect(compiled.textContent).toContain('Rows Loaded');
  });
});
