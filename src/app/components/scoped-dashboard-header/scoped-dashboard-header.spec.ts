import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScopedDashboardHeader } from './scoped-dashboard-header';

describe('ScopedDashboardHeader', () => {
  let component: ScopedDashboardHeader;
  let fixture: ComponentFixture<ScopedDashboardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedDashboardHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScopedDashboardHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
