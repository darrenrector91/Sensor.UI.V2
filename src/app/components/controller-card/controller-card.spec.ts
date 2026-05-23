import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ControllerCard } from './controller-card';
import { DashboardController } from '../../models/dashboard-controller';

describe('ControllerCard', () => {
  let component: ControllerCard;
  let fixture: ComponentFixture<ControllerCard>;

  const controller: DashboardController = {
    controllerId: 1,
    controllerKey: 'greenhouse-01',
    controllerName: 'Greenhouse Controller',
    location: 'Garden',
    sensors: [
      {
        sensorId: 1,
        sensorKey: 'sht35-01',
        sensorName: 'SHT35 Sensor',
        sensorType: 'TemperatureHumidity',
        measurements: [
          {
            controllerId: 1,
            controllerKey: 'greenhouse-01',
            controllerName: 'Greenhouse Controller',
            location: 'Garden',
            sensorId: 1,
            sensorKey: 'sht35-01',
            sensorName: 'SHT35 Sensor',
            sensorType: 'TemperatureHumidity',
            measurementType: 'Humidity',
            value: '58.15',
            unit: '%',
            createdUtc: '2026-05-22T20:49:21.01768'
          },
          {
            controllerId: 1,
            controllerKey: 'greenhouse-01',
            controllerName: 'Greenhouse Controller',
            location: 'Garden',
            sensorId: 1,
            sensorKey: 'sht35-01',
            sensorName: 'SHT35 Sensor',
            sensorType: 'TemperatureHumidity',
            measurementType: 'Temperature',
            value: '20.35',
            unit: 'C',
            createdUtc: '2026-05-22T20:49:20.734983'
          }
        ]
      }
    ]
  };

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
