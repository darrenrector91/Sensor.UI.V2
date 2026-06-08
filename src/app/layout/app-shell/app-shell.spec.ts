import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AppShell } from './app-shell';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('AppShell', () => {
  let component: AppShell;
  let fixture: ComponentFixture<AppShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppShell, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(AppShell);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
