import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { Controller } from '../../models/controller';
import { ControllerCard } from './controller-card';

describe('ControllerCard', () => {
  let component: ControllerCard;
  let fixture: ComponentFixture<ControllerCard>;

  const controller = Object.assign(new Controller(), {
    id: 1,
    controllerKey: 'greenhouse-01',
    name: 'Greenhouse Controller',
    location: 'Garden',
    locationId: 1,
    isActive: true,
    createdUtc: '2026-05-22T20:49:17.734983',
    sensorCount: 2,
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerCard, NoopAnimationsModule],
      providers: [provideRouter([])],
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

  it('should render the controller status', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Configured');
  });
});
