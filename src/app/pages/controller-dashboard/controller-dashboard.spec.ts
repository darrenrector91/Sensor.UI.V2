import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ControllerDashboard } from './controller-dashboard';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { provideHttpClient } from '@angular/common/http';

describe('ControllerDashboard', () => {
  let component: ControllerDashboard;
  let fixture: ComponentFixture<ControllerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerDashboard],
      providers: [
        {
          provide: DashboardMeasurementsService,
          useValue: {
            getMeasurements: () => of([]),
          },
        },
        provideHttpClient(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControllerDashboard);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
