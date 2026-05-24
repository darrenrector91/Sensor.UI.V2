import { AfterViewInit, Component, ElementRef, input, OnChanges, OnDestroy, SimpleChanges, ViewChild } from '@angular/core';
import {
  CategoryScale,
  Chart,
  Filler,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Tooltip
} from 'chart.js';
import { DashboardMeasurement } from '../../models/dashboard-measurement';

Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement, Tooltip, Filler);

@Component({
  selector: 'app-measurement-line-chart',
  imports: [],
  templateUrl: './measurement-line-chart.html',
  styleUrl: './measurement-line-chart.scss'
})
export class MeasurementLineChart implements AfterViewInit, OnChanges, OnDestroy {
  readonly measurements = input.required<DashboardMeasurement[]>();
  readonly label = input.required<string>();
  readonly unit = input('');

  @ViewChild('chartCanvas') private chartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['measurements'] && this.chartCanvas) {
      this.renderChart();
    }
  }

  ngOnDestroy(): void {
    this.chart?.destroy();
  }

  private renderChart(): void {
    const canvas = this.chartCanvas?.nativeElement;

    if (!canvas) {
      return;
    }

    const chartPoints = [...this.measurements()]
      .map(measurement => ({
        value: Number(measurement.value),
        createdUtc: measurement.createdUtc
      }))
      .filter(point => !Number.isNaN(point.value))
      .sort((first, second) => new Date(first.createdUtc).getTime() - new Date(second.createdUtc).getTime());

    this.chart?.destroy();

    this.chart = new Chart(canvas, {
      type: 'line',
      data: {
        labels: chartPoints.map(point => this.formatLabel(point.createdUtc)),
        datasets: [
          {
            label: this.label(),
            data: chartPoints.map(point => point.value),
            borderWidth: 2,
            pointRadius: 2,
            pointHoverRadius: 4,
            tension: 0.35,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          intersect: false,
          mode: 'index'
        },
        plugins: {
          tooltip: {
            callbacks: {
              label: context => `${context.dataset.label}: ${context.parsed.y} ${this.unit()}`
            }
          }
        },
        scales: {
          x: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.55)',
              maxTicksLimit: 5
            }
          },
          y: {
            grid: {
              color: 'rgba(255, 255, 255, 0.06)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.55)'
            }
          }
        }
      }
    });
  }

  private formatLabel(createdUtc: string): string {
    return new Date(createdUtc).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  }
}
