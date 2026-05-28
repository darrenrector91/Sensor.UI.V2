import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { DeviceAdminService } from '../../../services/device-admin.service';
import { DeviceCreateDialogComponent } from './device-create-dialog';

describe('DeviceCreateDialogComponent', () => {
  let component: DeviceCreateDialogComponent;
  let fixture: ComponentFixture<DeviceCreateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeviceCreateDialogComponent, HttpClientTestingModule],
      providers: [
        DeviceAdminService,
        {
          provide: MatDialogRef,
          useValue: {
            close: jasmine.createSpy('close'),
          },
        },
        {
          provide: MAT_DIALOG_DATA,
          useValue: {
            mode: 'controller',
            location: 'Garden',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeviceCreateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
