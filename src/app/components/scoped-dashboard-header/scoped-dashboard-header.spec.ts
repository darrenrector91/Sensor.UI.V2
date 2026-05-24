import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ScopedDashboardHeader } from './scoped-dashboard-header';

describe('ScopedDashboardHeader', () => {
  let component: ScopedDashboardHeader;
  let fixture: ComponentFixture<ScopedDashboardHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScopedDashboardHeader],
      providers: [provideRouter([])]
    }).compileComponents();

    fixture = TestBed.createComponent(ScopedDashboardHeader);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('title', 'Greenhouse Controller');
    fixture.componentRef.setInput('subtitle', 'greenhouse-01 · Garden');
    fixture.componentRef.setInput('latestUpdatedUtc', '2026-05-22T20:49:21.01768');
    fixture.componentRef.setInput('selectedTimeRange', '24H');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render title and subtitle', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('Greenhouse Controller');
    expect(compiled.textContent).toContain('greenhouse-01 · Garden');
  });

  it('should emit refresh requests', () => {
    spyOn(component.refreshRequested, 'emit');

    const button = fixture.nativeElement.querySelector('.scoped-dashboard-header__refresh') as HTMLButtonElement;
    button.click();

    expect(component.refreshRequested.emit).toHaveBeenCalled();
  });

  it('should render time range options', () => {
    const compiled = fixture.nativeElement as HTMLElement;

    expect(compiled.textContent).toContain('24H');
    expect(compiled.textContent).toContain('30D');
  });
});
