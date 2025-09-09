import { Component, Input, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { TimeInRangeData } from '../models/clinic.models';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-time-in-range-chart',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  template: `
    <div class="bg-white p-6 rounded-lg shadow-lg">
      <div class="flex items-center justify-between mb-2">
        <h3 class="text-lg font-semibold text-gray-800">Time in range</h3>
        <button 
          class="text-gray-400 hover:text-gray-600"
          title="Based on standard of care ranges for Time in range."
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"/>
          </svg>
        </button>
      </div>

      <!-- Vertical stacked bar -->
      <div class="flex justify-center">
        <div class="relative h-64 w-16 flex justify-center">
          <canvas
            baseChart
            #chart
            [data]="barChartData"
            [options]="barChartOptions"
            [type]="barChartType">
          </canvas>
        </div>
      </div>

      <!-- Horizontal stacked colored legend (range bar) -->
      <div class="mt-4 flex flex-col items-center">
        <!-- Horizontal stacked legend -->
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

        <!-- mg/dL labels (separate, aligned with bar) -->
        <div class="flex justify-between w-[300px] text-[10px] mt-1 text-gray-500 font-medium">
          <span>40</span>
          <span>54</span>
          <span>70</span>
          <span>180</span>
          <span>240</span>
          <span>400</span>
        </div>
      </div>
    </div>
  `
})
export class TimeInRangeChartComponent implements OnChanges {
  @Input() data: TimeInRangeData | null = null;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public barChartType: ChartType = 'bar';

  public ranges = [
    { label: 'Very Low (<54 mg/dL)', color: '#DC2626', info: 'Dangerously low glucose levels.', width: 14 },
    { label: 'Low (54-69 mg/dL)', color: '#F59E0B', info: 'Below target range.', width: 16 },
    { label: 'Target (70-180 mg/dL)', color: '#10B981', info: 'Desired glucose range.', width: 110 },
    { label: 'High (181-250 mg/dL)', color: '#F59E0B', info: 'Above target range.', width: 70 },
    { label: 'Very High (>250 mg/dL)', color: '#DC2626', info: 'Dangerously high glucose levels.', width: 160 }
  ];

  getRangeLabel(index: number): string {
    if (!this.data) return '0%';
    const values = [
      this.data.veryLow,
      this.data.low,
      this.data.target,
      this.data.high,
      this.data.veryHigh
    ];
    return values[index] + '%';
  }

  public barChartData: ChartData<'bar'> = {
    labels: [''],
    datasets: this.ranges.map(range => ({
      label: range.label,
      data: [0],
      backgroundColor: range.color,
      borderColor: '#fff',
      borderWidth: 1,
    }))
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { stacked: true, display: false },
      y: { stacked: true, display: false, beginAtZero: true, max: 100 }
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const range = this.ranges[context.datasetIndex || 0];
            return `${context.dataset.label}: ${context.parsed.y.toFixed(1)}% — ${range.info}`;
          }
        }
      }
    },
    elements: {
      bar: { borderRadius: 2 }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.data) return;
    const percentages = [
      this.data.veryLow,
      this.data.low,
      this.data.target,
      this.data.high,
      this.data.veryHigh
    ];
    this.barChartData.datasets.forEach((ds, i) => { ds.data = [percentages[i]]; });
    this.chart?.update();
  }
}
