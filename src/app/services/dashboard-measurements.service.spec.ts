import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DashboardMeasurementsService } from './dashboard-measurements.service';

describe('DashboardMeasurementsService', () => {
  let service: DashboardMeasurementsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(DashboardMeasurementsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request dashboard measurements', () => {
    service.getMeasurements().subscribe(measurements => {
      expect(measurements).toEqual([]);
    });

    const request = httpTestingController.expectOne('http://192.168.5.103:5278/api/dashboard/measurements');

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });

  it('should request sensor measurement history', () => {
    service.getSensorMeasurements(1).subscribe(measurements => {
      expect(measurements).toEqual([]);
    });

    const request = httpTestingController.expectOne('http://192.168.5.103:5278/api/sensors/1/measurements');

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });
});
