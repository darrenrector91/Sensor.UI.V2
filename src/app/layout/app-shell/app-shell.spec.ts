import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { AppShell } from './app-shell';
import { DashboardMeasurementsService } from '../../services/dashboard-measurements.service';
import { DeviceAdminService } from '../../services/device-admin.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

const dashboardMeasurementsServiceStub = {};
const deviceAdminServiceStub = {
  getLocations: () => of([]),
  getControllers: () => of([]),
};
const matDialogStub = {
  open: () => ({ afterClosed: () => of(null) }),
};


describe('AppShell', () => {
  let component: AppShell;
  let fixture: ComponentFixture<AppShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShell, HttpClientTestingModule],
      providers: [
        { provide: DashboardMeasurementsService, useValue: dashboardMeasurementsServiceStub },
        { provide: DeviceAdminService, useValue: deviceAdminServiceStub },
        { provide: MatDialog, useValue: matDialogStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
