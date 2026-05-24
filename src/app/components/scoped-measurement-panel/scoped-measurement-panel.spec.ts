import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopedMeasurementPanel } from './scoped-measurement-panel';

describe('ScopedMeasurementPanel', () => {
  let component: ScopedMeasurementPanel;
  let fixture: ComponentFixture<ScopedMeasurementPanel>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedMeasurementPanel]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopedMeasurementPanel);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
