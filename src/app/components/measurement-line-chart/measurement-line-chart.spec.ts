import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { MeasurementLineChart } from './measurement-line-chart';

describe('MeasurementLineChart', () => {
  let component: MeasurementLineChart;
  let fixture: ComponentFixture<MeasurementLineChart>;

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
      'Temperature',
      '21',
      'C',
      '2026-05-22T21:49:20.734983',
    ),
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MeasurementLineChart],
    }).compileComponents();

    fixture = TestBed.createComponent(MeasurementLineChart);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('measurements', measurements);
    fixture.componentRef.setInput('label', 'Temperature');
    fixture.componentRef.setInput('unit', 'C');
    fixture.componentRef.setInput('accentColor', '#d8e534');
    fixture.componentRef.setInput('maxPoints', 48);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render a canvas when enough data exists', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.querySelector('canvas')).toBeTruthy();
  });

  it('should render an empty state when fewer than two numeric readings exist', () => {
    fixture.componentRef.setInput('measurements', [measurements[0]]);
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('More readings needed for a trend.');
  });
});
