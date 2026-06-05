import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerDetails } from './controller-details';

describe('ControllerDetails', () => {
  let component: ControllerDetails;
  let fixture: ComponentFixture<ControllerDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerDetails]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerDetails);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
