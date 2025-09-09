import { Component, Input } from '@angular/core';
import {ChartConfiguration} from 'chart.js'

@Component({
  selector: 'app-time-in-range-chart',
  imports: [],
  templateUrl: './time-in-range-chart.html',
  styleUrl: './time-in-range-chart.css',
  template: `
    <div class="bg-white p-4 rounded-2xl shadow-md">
      <h2 class="text-xl font-semibold mb-2">Time in Range</h2>
      <canvas baseChart [data]="barChartData" [type]="'bar'"></canvas>
    </div>`
})
export class TimeInRangeChart {
  @Input() data: any;

  get barChartData(): ChartConfiguration<'bar'>['data'] {
    return {
      labels: ['In Range', 'Above Range', 'Below Range'],
      datasets: [{
        data: [this.data?.inRange, this.data?.aboveRange, this.data?.belowRange],
        label: '%',
        backgroundColor: ['#16a34a', '#dc2626', '#2563eb']
      }]
    };
  }
}
