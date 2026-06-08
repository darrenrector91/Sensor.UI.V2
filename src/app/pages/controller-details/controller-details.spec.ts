import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ControllerDetails } from './controller-details';
import { DeviceAdminService } from '../../services/device-admin.service';

const deviceAdminServiceStub = {
  getControllerDetails: () =>
    of({
      id: 1,
      name: 'Controller 1',
      location: 'Lab',
      controllerKey: 'CTRL-1',
      sensorCount: 0,
      isActive: true,
    }),
  getSensors: () => of([]),
};

const activatedRouteStub = {
  snapshot: {
    paramMap: {
      get: () => '1',
    },
  },
};

const routerStub = {
  url: '/controllers/1',
};

const matDialogStub = {
  open: () => ({ afterClosed: () => of(null) }),
};

describe('ControllerDetails', () => {
  let component: ControllerDetails;
  let fixture: ComponentFixture<ControllerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerDetails],
      providers: [
        { provide: DeviceAdminService, useValue: deviceAdminServiceStub },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerStub },
        { provide: MatDialog, useValue: matDialogStub },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ControllerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
