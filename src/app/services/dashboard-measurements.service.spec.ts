import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { DashboardMeasurementsService } from './dashboard-measurements.service';

describe('DashboardMeasurementsService', () => {
  let service: DashboardMeasurementsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });

    service = TestBed.inject(DashboardMeasurementsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should request dashboard measurements', () => {
    service.getMeasurements().subscribe((measurements) => {
      expect(measurements).toEqual([]);
    });

    const request = httpTestingController.expectOne(
      'http://192.168.5.103:5278/api/dashboard/measurements',
    );

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });

  it('should request sensor measurement history', () => {
    service.getSensorMeasurements(1).subscribe((measurements) => {
      expect(measurements).toEqual([]);
    });

    const request = httpTestingController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === 'http://192.168.5.103:5278/api/sensors/1/measurements' &&
        req.params.get('limit') === '500',
    );

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });

  it('should request sensor measurement history with range params', () => {
    service
      .getSensorMeasurements(1, '2026-05-18T00:00:00.000Z', '2026-05-25T00:00:00.000Z', 250)
      .subscribe((measurements) => {
        expect(measurements).toEqual([]);
      });

    const request = httpTestingController.expectOne(
      (req) =>
        req.method === 'GET' &&
        req.url === 'http://192.168.5.103:5278/api/sensors/1/measurements' &&
        req.params.get('fromUtc') === '2026-05-18T00:00:00.000Z' &&
        req.params.get('toUtc') === '2026-05-25T00:00:00.000Z' &&
        req.params.get('limit') === '250',
    );

    expect(request.request.method).toBe('GET');

    request.flush([]);
  });
});
