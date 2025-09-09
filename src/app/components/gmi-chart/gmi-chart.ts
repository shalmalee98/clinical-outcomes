import { Component, Input } from '@angular/core';
import { ChartConfiguration } from 'chart.js';

@Component({
  selector: 'app-gmi-chart',
  imports: [],
  templateUrl: './gmi-chart.html',
  styleUrl: './gmi-chart.css',
  template: `
    <div class="bg-white p-4 rounded-2xl shadow-md">
      <h2 class="text-xl font-semibold mb-2">Glucose Management Indicator</h2>
      <canvas baseChart [data]="pieChartData" [type]="'pie'"></canvas>
    </div>
  `
})
export class GmiChart {
  @Input() data: any;

  get pieChartData(): ChartConfiguration<'pie'>['data'] {
    return {
      labels: ['Low', 'Normal', 'High'],
      datasets: [{
        data: [
          this.data?.breakdown.low,
          this.data?.breakdown.normal,
          this.data?.breakdown.high
        ],
        backgroundColor: ['#f97316', '#16a34a', '#dc2626']
      }]
    };
  }
}
