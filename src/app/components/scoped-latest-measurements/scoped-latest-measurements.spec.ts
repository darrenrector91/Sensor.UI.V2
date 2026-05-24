import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { ScopedLatestMeasurements } from './scoped-latest-measurements';

describe('ScopedLatestMeasurements', () => {
  let component: ScopedLatestMeasurements;
  let fixture: ComponentFixture<ScopedLatestMeasurements>;

  const measurements = [
    new DashboardMeasurement(
      1,
      'greenhouse-01',
      'Greenhouse Controller',
      'Garden',
      1,
      'sht35-01',
      'SHT35 Sensor',
      'TemperatureHumidity',
      'Temperature',
      '20',
      'C',
      '2026-05-22T20:49:20.734983'
    ),
    new DashboardMeasurement(
      1,
      'greenhouse-01',
      'Greenhouse Controller',
      'Garden',
      1,
      'sht35-01',
      'SHT35 Sensor',
      'TemperatureHumidity',
      'Humidity',
      '58.15',
      '%',
      '2026-05-22T20:49:21.01768'
    )
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedLatestMeasurements]
    }).compileComponents();

    fixture = TestBed.createComponent(ScopedLatestMeasurements);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('measurements', measurements);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render latest measurement labels and values', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Temperature');
    expect(compiled.textContent).toContain('Humidity');
    expect(compiled.textContent).toContain('20.0');
    expect(compiled.textContent).toContain('68.0');
    expect(compiled.textContent).toContain('58.2');
  });
});
