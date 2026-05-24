import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ScopedDashboard } from './scoped-dashboard';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { SensorMeasurementHistory } from '../../models/sensor-measurement-history';

describe('ScopedDashboard', () => {
  let component: ScopedDashboard;
  let fixture: ComponentFixture<ScopedDashboard>;

  const dashboardRows = [
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
    )
  ];

  const historyRows = [
    new SensorMeasurementHistory(
      230,
      1,
      'Humidity',
      '62.20',
      '%',
      '2026-05-23T20:49:17.533671'
    ),
    new SensorMeasurementHistory(
      229,
      1,
      'Temperature',
      '19.85',
      'C',
      '2026-05-23T20:49:17.31625'
    )
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedDashboard],
      providers: [
        provideRouter([]),
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              routeConfig: {
                path: 'dashboard/sensor/:sensorId'
              },
              paramMap: {
                get: (key: string) => key === 'sensorId' ? '1' : null
              }
            }
          }
        },
        {
          provide: DashboardMeasurementsService,
          useValue: {
            getMeasurements: () => of(dashboardRows),
            getSensorMeasurements: () => of(historyRows)
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ScopedDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render mapped sensor history with dashboard metadata', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('SHT35 Sensor');
    expect(compiled.textContent).toContain('Temperature');
    expect(compiled.textContent).toContain('Humidity');
    expect(compiled.textContent).toContain('62.20');
    expect(compiled.textContent).toContain('19.9');
  });
});
