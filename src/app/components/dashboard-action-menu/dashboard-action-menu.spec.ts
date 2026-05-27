import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardActionMenu } from './dashboard-action-menu';

describe('DashboardActionMenu', () => {
  let component: DashboardActionMenu;
  let fixture: ComponentFixture<DashboardActionMenu>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardActionMenu]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardActionMenu);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
