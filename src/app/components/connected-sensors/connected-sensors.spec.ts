import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectedSensors } from './connected-sensors';

describe('ConnectedSensors', () => {
  let component: ConnectedSensors;
  let fixture: ComponentFixture<ConnectedSensors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConnectedSensors]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConnectedSensors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
