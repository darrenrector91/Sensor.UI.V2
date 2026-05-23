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
            'SoilMoisture',
            '42',
            '%',
            '2026-05-22T20:49:19.734983'
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
            'Light',
            '812',
            'lux',
            '2026-05-22T20:49:18.734983'
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
            'BatteryVoltage',
            '4.1',
            'V',
            '2026-05-22T20:49:17.734983'
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

  it('should render top priority measurement labels', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Temperature');
    expect(compiled.textContent).toContain('Humidity');
    expect(compiled.textContent).toContain('Soil Moisture');
    expect(compiled.textContent).toContain('Light');
  });

  it('should not render metrics beyond the compact card limit', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).not.toContain('Battery');
    expect(compiled.textContent).toContain('+1 more measurement');
  });

  it('should render dynamic measurement icons', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('humidity_percentage');
    expect(compiled.textContent).toContain('thermostat');
    expect(compiled.textContent).toContain('water_drop');
    expect(compiled.textContent).toContain('wb_sunny');
  });
});
