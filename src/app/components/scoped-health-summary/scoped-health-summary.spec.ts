import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopedHealthSummary } from './scoped-health-summary';

describe('ScopedHealthSummary', () => {
  let component: ScopedHealthSummary;
  let fixture: ComponentFixture<ScopedHealthSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedHealthSummary]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopedHealthSummary);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
