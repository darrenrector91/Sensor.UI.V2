import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

import { ScopedDashboardDataService } from './scoped-dashboard-data.service';

describe('ScopedDashboardDataService', () => {
  let service: ScopedDashboardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(ScopedDashboardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
