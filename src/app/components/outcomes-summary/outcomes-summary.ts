import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-outcomes-summary',
  imports: [],
  templateUrl: './outcomes-summary.html',
  styleUrl: './outcomes-summary.css',
  template: `
    <div class="bg-white p-4 rounded-2xl shadow-md space-y-2">
      <p class="text-lg font-semibold">Active Patients: {{data?.activePatients}}</p>
      <p class="text-gray-600">Date Range: {{data?.dateRange}}</p>
      <p class="text-gray-500 text-sm">Last Updated: {{data?.lastUpdated | date:'short'}}</p>
    </div>
  `
})
export class OutcomesSummary {
  @Input() data: any;
}
