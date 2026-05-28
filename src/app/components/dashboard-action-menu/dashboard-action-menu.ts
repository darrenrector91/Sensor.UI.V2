import { CommonModule } from '@angular/common';
import { Component, ElementRef, EventEmitter, HostListener, Output, signal } from '@angular/core';

@Component({
  selector: 'app-dashboard-action-menu',
  imports: [CommonModule],
  templateUrl: './dashboard-action-menu.html',
  styleUrl: './dashboard-action-menu.scss',
})
export class DashboardActionMenu {
  @Output() createController = new EventEmitter<void>();
  @Output() createSensor = new EventEmitter<void>();
  @Output() createLocation = new EventEmitter<void>();

  protected readonly isAddMenuOpen = signal(false);

  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  @HostListener('document:click', ['$event'])
  protected onDocumentClick(event: MouseEvent): void {
    const target = event.target as Node;

    if (!this.elementRef.nativeElement.contains(target)) {
      this.isAddMenuOpen.set(false);
    }
  }

  @HostListener('document:keydown.escape')
  protected onEscape(): void {
    this.isAddMenuOpen.set(false);
  }

  protected toggleAddMenu(): void {
    this.isAddMenuOpen.update((current) => !current);
  }

  protected onCreateController(): void {
    this.isAddMenuOpen.set(false);
    this.createController.emit();
  }

  protected onCreateSensor(): void {
    this.isAddMenuOpen.set(false);
    this.createSensor.emit();
  }

  protected onCreateLocation(): void {
    this.isAddMenuOpen.set(false);
    this.createLocation.emit();
  }
}
