import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllerDetailsHeader } from './controller-details-header';

describe('ControllerDetailsHeader', () => {
  let component: ControllerDetailsHeader;
  let fixture: ComponentFixture<ControllerDetailsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ControllerDetailsHeader]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ControllerDetailsHeader);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
