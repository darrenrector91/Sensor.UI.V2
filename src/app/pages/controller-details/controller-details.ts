import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, signal } from '@angular/core';
import { ControllerDetailsHeader } from '../../components/controller-details-header/controller-details-header';
import { OverviewCard } from '../../components/overview-card/overview-card';
import { Controller } from '../../models/controller';
import { Overview } from '../../models/overview';
import { DeviceAdminService } from '../../services/device-admin.service';

@Component({
  selector: 'app-controller-details',
  standalone: true,
  imports: [CommonModule, ControllerDetailsHeader, OverviewCard],
  templateUrl: './controller-details.html',
  styleUrls: ['./controller-details.scss'],
})
export class ControllerDetails implements OnInit {
  protected readonly isLoading = signal(false);
  protected readonly errorMessage = signal<string | null>(null);

  controller: Controller | null = null;
  overviewCards: Overview[] = [];

  private readonly deviceAdminService = inject(DeviceAdminService);

  ngOnInit(): void {
    this.getControllerDetails();
  }

  constructor() {}

  protected getControllerDetails(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.deviceAdminService.getControllerDetails(1).subscribe({
      next: (controller) => {
        console.log('controller', controller);
        this.controller = controller;
        this.buildOverviewCards();
        this.isLoading.set(false);
      },

      error: () => {
        this.errorMessage.set('Unable to load controller details.');
        this.isLoading.set(false);
      },
    });
  }

  private buildOverviewCards(): void {
    if (!this.controller) {
      this.overviewCards = [];
      return;
    }

    this.overviewCards = [
      {
        icon: 'bi-geo-alt',
        label: 'Location',
        primaryText: this.controller.location ?? 'Unknown',
        secondaryText: this.controller.controllerKey,
        statusClass: 'status-success',
      },
      {
        icon: 'bi-broadcast',
        label: 'Sensors',
        primaryText: this.controller.sensorCount.toString(),
        secondaryText: 'Connected',
        statusClass: 'status-success',
      },
      // {
      //   icon: 'bi-calendar3',
      //   label: 'Created',
      //   primaryText: this.formatDate(this.controller.createdUtc),
      //   secondaryText: '',
      //   statusClass: 'status-success',
      // },
      // {
      //   icon: 'bi-clock-history',
      //   label: 'Last Updated',
      //   primaryText: this.controller.lastUpdatedDateDisplay
      //     ? this.formatDate(this.controller.lastUpdatedDateDisplay)
      //     : 'Unknown',
      //   secondaryText: '',
      //   statusClass: 'status-success',
      // },
      {
        icon: 'bi-shield-check',
        label: 'Status',
        primaryText: this.controller.isActive ? 'Online' : 'Offline',
        secondaryText: '',
        statusClass: this.controller.isActive ? 'status-success' : 'status-danger',
      },
    ];
  }

  private formatDate(dateUtc: string): string {
    const parsedDate = new Date(dateUtc);

    if (Number.isNaN(parsedDate.getTime())) {
      return dateUtc;
    }

    return parsedDate.toLocaleString([], {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
