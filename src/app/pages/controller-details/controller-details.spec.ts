import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ControllerDetails } from './controller-details';
import { DeviceAdminService } from '../../services/device-admin.service';

describe('ControllerDetails', () => {
  let component: ControllerDetails;
  let fixture: ComponentFixture<ControllerDetails>;

  const mockDeviceAdminService = {
    getControllerDetails: () =>
      of({
        id: 1,
        controllerKey: 'greenhouse-01',
        location: 'Garden',
        sensorCount: 0,
        isActive: true,
      }),
    getSensors: () => of([]),
    getLocations: () => of([]),
    getControllers: () => of([]),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerDetails],
      providers: [
        { provide: DeviceAdminService, useValue: mockDeviceAdminService },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: { get: () => '1' } } },
        },
        {
          provide: Router,
          useValue: { url: '/controllers/1', navigate: () => Promise.resolve(true) },
        },
        { provide: MatDialog, useValue: { open: () => ({ afterClosed: () => of(null) }) } },
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
