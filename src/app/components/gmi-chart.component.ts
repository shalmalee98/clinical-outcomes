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
      <h3 class="text-xl font-semibold mb-4 text-gray-800">
        Glucose Management Indicator (GMI)
      </h3>

      <div class="flex items-center justify-center">
        <div class="relative w-64 h-64">
          <canvas
            baseChart
            #chart
            [data]="pieChartData"
            [options]="pieChartOptions"
            [type]="pieChartType">
          </canvas>

          <!-- Center text -->
          <div class="absolute inset-0 flex items-center justify-center">
            <div class="text-center">
              <div class="text-4xl font-bold text-gray-800 leading-tight">
                {{ data?.percentage || 0 }}%
              </div>
              <div class="text-base font-medium text-gray-600">
                {{ data?.category || 'N/A' }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="mt-4 text-center text-sm text-gray-600">
        <p>Target Range: {{ data?.targetRange || 'N/A' }}</p>
      </div>
    </div>
  `
})
export class GMIChartComponent implements OnChanges {
  @Input() data: GMIData | null = null;
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  public pieChartType: ChartType = 'doughnut';
  public pieChartData: ChartData<'doughnut'> = {
    labels: ['GMI', 'Remaining'],
    datasets: [
      {
        data: [0, 100],
        backgroundColor: ['#3B82F6', '#E5E7EB'],
        borderColor: ['#2563EB', '#D1D5DB'],
        borderWidth: 2
      }
    ]
  };

  public pieChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    // cutout: '70%', // nice inner radius
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false }
    }
  };

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.updateChartData();
    }
  }

  private updateChartData(): void {
    if (!this.data) return;

    const percentage = this.data.percentage;
    const remaining = Math.max(0, 100 - percentage);

    this.pieChartData.datasets[0].data = [percentage, remaining];

    const color = this.getCategoryColor(this.data.category);
    this.pieChartData.datasets[0].backgroundColor = [color, '#E5E7EB'];
    this.pieChartData.datasets[0].borderColor = [this.getDarkerColor(color), '#D1D5DB'];

    this.chart?.update();
  }

  private getCategoryColor(category: string): string {
    switch (category) {
      case 'Excellent': return '#10B981'; // Green
      case 'Good': return '#3B82F6'; // Blue
      case 'Fair': return '#F59E0B'; // Amber
      case 'Poor': return '#DC2626'; // Red
      default: return '#6B7280'; // Gray
    }
  }

  private getDarkerColor(color: string): string {
    switch (color) {
      case '#10B981': return '#059669';
      case '#3B82F6': return '#2563EB';
      case '#F59E0B': return '#D97706';
      case '#DC2626': return '#B91C1C';
      default: return '#4B5563';
    }
  }
}
