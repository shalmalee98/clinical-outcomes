import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { GMIData } from '../models/clinic.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gmi-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-800">
          Glucose Management Indicator (GMI)
        </h3>
      </div>

      <!-- Donut Chart -->
      <div class="flex items-center justify-center">
        <div class="relative w-56 h-60">
          <canvas
            baseChart
            #chart
            [data]="pieChartData"
            [options]="pieChartOptions"
            [type]="pieChartType">
          </canvas>

          <!-- Center text -->
          <div class="absolute inset-0 flex flex-col items-center justify-center">
            <span class="text-xs text-gray-500 tracking-wide">AVERAGE GMI</span>
            <span class="text-3xl font-bold text-gray-800">
              {{ data?.percentage || 0 }}%
            </span>
          </div>
        </div>
      </div>

      <!-- Horizontal stacked legend -->
      <div class="mt-6 flex flex-col items-center">
        <div class="flex w-[300px] h-3 rounded overflow-hidden">
          <div
            *ngFor="let range of ranges; let i = index"
            [style.backgroundColor]="range.color"
            class="relative flex-1 flex justify-center items-center"
          >
            <span
              *ngIf="data"
              class="absolute -top-4 text-[10px] font-medium text-gray-700"
            >
              {{ getRangeLabel(i) }}
            </span>
          </div>
        </div>

        <!-- GMI ranges labels -->
        <div class="flex justify-between w-[300px] text-[10px] mt-1 text-gray-500 font-medium">
          <span>≤7%</span>
          <span>7–7.8%</span>
          <span>≥8%</span>
        </div>
      </div>
    </div>
  `
})
export class GMIChartComponent implements OnChanges {
  @Input() data: GMIData | null = null;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public pieChartType: ChartType = 'doughnut';
  public pieChartData: ChartData<'doughnut'> = {
    labels: ['≤7%', '7–7.8%', '≥8%'],
    datasets: [
      {
        data: [0, 0, 0],
        backgroundColor: ['#10B981', '#F59E0B', '#DC2626'],
        borderWidth: 0
      }
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // cutout: '70%',
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => `${context.label}: ${context.parsed}%`
        }
      }
    }
  };

  public ranges = [
    { label: '≤7%', color: '#10B981' },
    { label: '7–7.8%', color: '#F59E0B' },
    { label: '≥8%', color: '#DC2626' }
  ];

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.data) return;

    // Example distribution (replace with real backend values if available)
    const distribution = this.calculateDistribution(this.data.percentage);

    this.pieChartData.datasets[0].data = distribution;
    this.chart?.update();
  }

  /** Returns distribution that always sums to 100% */
  private calculateDistribution(gmi: number): number[] {
    // Example: simple distribution logic
    if (gmi <= 7) return [72, 23, 5];   // good, fair, poor
    if (gmi > 7 && gmi <= 7.8) return [20, 60, 20];
    return [10, 25, 65];
  }

  getRangeLabel(index: number): string {
    const values = this.pieChartData.datasets[0].data as number[];
    return values[index] ? `${values[index]}%` : '0%';
  }
}
