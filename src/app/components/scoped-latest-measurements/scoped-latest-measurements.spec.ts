import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopedLatestMeasurements } from './scoped-latest-measurements';

describe('ScopedLatestMeasurements', () => {
  let component: ScopedLatestMeasurements;
  let fixture: ComponentFixture<ScopedLatestMeasurements>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedLatestMeasurements]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopedLatestMeasurements);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
