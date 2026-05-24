import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { ScopedMeasurementGroup } from '../../models/scoped-measurement-group';
import { ScopedSensorGroup } from '../../models/scoped-sensor-group';
import { ScopedMeasurementPanel } from './scoped-measurement-panel';

describe('ScopedMeasurementPanel', () => {
  let component: ScopedMeasurementPanel;
  let fixture: ComponentFixture<ScopedMeasurementPanel>;

  const sensor = new ScopedSensorGroup(
    1,
    'SHT35 Sensor',
    'sht35-01',
    'TemperatureHumidity',
    [
      new ScopedMeasurementGroup(
        'Temperature',
        [
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
            'Temperature',
            '22',
            'C',
            '2026-05-22T19:49:20.734983'
          )
        ]
      )
    ]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedMeasurementPanel]
    }).compileComponents();

    fixture = TestBed.createComponent(ScopedMeasurementPanel);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('sensor', sensor);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render sensor and measurement data', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('SHT35 Sensor');
    expect(compiled.textContent).toContain('Temperature');
    expect(compiled.textContent).toContain('20.0');
    expect(compiled.textContent).toContain('68.0');
  });

  it('should render measurement statistics', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Min');
    expect(compiled.textContent).toContain('Avg');
    expect(compiled.textContent).toContain('Max');
    expect(compiled.textContent).toContain('Readings');
    expect(compiled.textContent).toContain('°C');
    expect(compiled.textContent).toContain('°F');
    expect(compiled.textContent).toContain('71.6');
  });
});
