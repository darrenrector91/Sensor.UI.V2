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
  readonly accentColor = input('#58efc3');

  @ViewChild('chartCanvas') private chartCanvas?: ElementRef<HTMLCanvasElement>;

  private chart?: Chart<'line'>;

  ngAfterViewInit(): void {
    this.renderChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if ((changes['measurements'] || changes['label'] || changes['unit'] || changes['accentColor']) && this.chartCanvas) {
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
            borderColor: this.accentColor(),
            backgroundColor: this.getGradient(canvas),
            borderWidth: 2,
            pointBackgroundColor: this.accentColor(),
            pointBorderColor: this.accentColor(),
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
          legend: {
            display: false
          },
          tooltip: {
            backgroundColor: 'rgba(3, 18, 13, 0.94)',
            borderColor: this.accentColor(),
            borderWidth: 1,
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            displayColors: false,
            callbacks: {
              label: context => `${context.dataset.label}: ${context.parsed.y} ${this.formatUnit()}`
            }
          }
        },
        scales: {
          x: {
            border: {
              color: 'rgba(255, 255, 255, 0.08)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.55)',
              maxTicksLimit: 5
            }
          },
          y: {
            border: {
              color: 'rgba(255, 255, 255, 0.08)'
            },
            grid: {
              color: 'rgba(255, 255, 255, 0.05)'
            },
            ticks: {
              color: 'rgba(255, 255, 255, 0.55)',
              callback: value => `${value} ${this.formatUnit()}`
            }
          }
        }
      }
    });
  }

  private getGradient(canvas: HTMLCanvasElement): CanvasGradient {
    const context = canvas.getContext('2d');
    const gradient = context?.createLinearGradient(0, 0, 0, canvas.height);

    if (!gradient) {
      throw new Error('Unable to create chart gradient.');
    }

    gradient.addColorStop(0, this.hexToRgba(this.accentColor(), 0.28));
    gradient.addColorStop(1, this.hexToRgba(this.accentColor(), 0.02));

    return gradient;
  }

  private formatLabel(createdUtc: string): string {
    return new Date(createdUtc).toLocaleTimeString([], {
      hour: 'numeric',
      minute: '2-digit'
    });
  }

  private formatUnit(): string {
    return this.unit().toUpperCase() === 'C' ? '°C' : this.unit();
  }

  private hexToRgba(hex: string, alpha: number): string {
    const cleanHex = hex.replace('#', '');
    const red = parseInt(cleanHex.substring(0, 2), 16);
    const green = parseInt(cleanHex.substring(2, 4), 16);
    const blue = parseInt(cleanHex.substring(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
  }
}
