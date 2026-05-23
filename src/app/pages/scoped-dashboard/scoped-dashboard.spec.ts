import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { ScopedDashboard } from './scoped-dashboard';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';

describe('ScopedDashboard', () => {
  let component: ScopedDashboard;
  let fixture: ComponentFixture<ScopedDashboard>;

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
                path: 'dashboard/controller/:controllerId'
              },
              paramMap: {
                get: (key: string) => key === 'controllerId' ? '1' : null
              }
            }
          }
        },
        {
          provide: DashboardMeasurementsService,
          useValue: {
            getMeasurements: () => of([])
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
});
