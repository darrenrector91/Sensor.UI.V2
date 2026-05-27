import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { DeviceAdminService } from './device-admin.service';

describe('DeviceAdminService', () => {
  let service: DeviceAdminService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    service = TestBed.inject(DeviceAdminService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
