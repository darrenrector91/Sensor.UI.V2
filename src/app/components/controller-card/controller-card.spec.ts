import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControllerCard } from './controller-card';
import { DashboardController } from '../../models/dashboard-controller';
import { DashboardMeasurement } from '../../models/dashboard-measurement';
import { DashboardSensor } from '../../models/dashboard-sensor';

describe('ControllerCard', () => {
  let component: ControllerCard;
  let fixture: ComponentFixture<ControllerCard>;

  const controller = new DashboardController(
    1,
    'greenhouse-01',
    'Greenhouse Controller',
    'Garden',
    [
      new DashboardSensor(
        1,
        'sht35-01',
        'SHT35 Sensor',
        'TemperatureHumidity',
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
            'Humidity',
            '58.15',
            '%',
            '2026-05-22T20:49:21.01768'
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
            '20.35',
            'C',
            '2026-05-22T20:49:20.734983'
          )
        ]
      )
    ]
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerCard, NoopAnimationsModule]
    }).compileComponents();

    fixture = TestBed.createComponent(ControllerCard);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('controller', controller);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render the controller name', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Greenhouse Controller');
  });

  it('should render the formatted sensor type', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Temperature / Humidity');
  });

  it('should render humidity and temperature values', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('58.15');
    expect(compiled.textContent).toContain('20.35');
  });
});
