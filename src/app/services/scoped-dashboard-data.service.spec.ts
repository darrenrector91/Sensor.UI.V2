import { TestBed } from '@angular/core/testing';

import { ScopedDashboardDataService } from './scoped-dashboard-data.service';

describe('ScopedDashboardDataService', () => {
  let service: ScopedDashboardDataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScopedDashboardDataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
