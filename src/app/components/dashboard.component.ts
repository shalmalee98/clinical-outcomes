import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { map, Observable } from 'rxjs';
import { TimeInRangeChartComponent } from './time-in-range-chart.component';
import { GMIChartComponent } from './gmi-chart.component';
import { TimeInRangeData, GMIData } from '../models/clinic.models';
import * as ClinicActions from '../store/clinic.actions';
import * as ClinicSelectors from '../store/clinic.selectors';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, TimeInRangeChartComponent, GMIChartComponent],
  template: `
    <div class="min-h-screen bg-gray-50 p-6">
      <div class="max-w-7xl mx-auto" id="dashboard-content">

        <!-- Header -->
        <div class="mb-6 flex items-center justify-between">
          <h1 class="text-3xl font-bold text-gray-900">Clinic Outcomes</h1>
          <div class="flex gap-2">
            <button
              (click)="setDateRange(30)"
              [class.bg-blue-600]="selectedRange === 30"
              [class.text-white]="selectedRange === 30"
              class="px-3 py-1 rounded-md border text-sm font-medium text-gray-700 hover:bg-blue-100">
              30 Days
            </button>
            <button
              (click)="setDateRange(60)"
              [class.bg-blue-600]="selectedRange === 60"
              [class.text-white]="selectedRange === 60"
              class="px-3 py-1 rounded-md border text-sm font-medium text-gray-700 hover:bg-blue-100">
              60 Days
            </button>
            <button
              (click)="setDateRange(90)"
              [class.bg-blue-600]="selectedRange === 90"
              [class.text-white]="selectedRange === 90"
              class="px-3 py-1 rounded-md border text-sm font-medium text-gray-700 hover:bg-blue-100">
              90 Days
            </button>
          </div>
        </div>

        <!-- Info Row -->
        <div class="flex flex-wrap gap-6 text-sm text-gray-600 mb-6">
          <div *ngIf="dateRange$ | async as dateRange" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
            <span>{{ formatDateRange(dateRange.startDate, dateRange.endDate) }}</span>
          </div>

          <div *ngIf="activePatients$ | async as activePatients" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2
                   c0-.656-.126-1.283-.356-1.857M7 20H2v-2
                   a3 3 0 015.356-1.857M7 20v-2
                   c0-.656.126-1.283.356-1.857
                   m0 0a5.002 5.002 0 019.288 0M15 7
                   a3 3 0 11-6 0 3 3 0 016 0zm6 3
                   a2 2 0 11-4 0 2 2 0 014 0zM7 10
                   a2 2 0 11-4 0 2 2 0 014 0z"></path>
            </svg>
            <span>{{ activePatients }} active patients</span>
          </div>

          <div *ngIf="lastUpdated$ | async as lastUpdated" class="flex items-center">
            <svg class="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0
                   9 9 0 0118 0z"></path>
            </svg>
            <span>Last updated: {{ formatLastUpdated(lastUpdated) }}</span>
          </div>
        </div>

        <!-- Loading -->
        <div *ngIf="loading$ | async" class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span class="ml-2 text-gray-600">Loading clinic data...</span>
        </div>

        <!-- Error -->
        <div *ngIf="error$ | async as error" class="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <span class="text-red-700">{{ error }}</span>
        </div>

        <!-- Charts Grid -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <app-time-in-range-chart [data]="timeInRangeData$ | async"></app-time-in-range-chart>
          <app-gmi-chart [data]="gmiData$ | async"></app-gmi-chart>
        </div>

        <!-- Actions -->
        <div class="mt-8 flex justify-center gap-4">
          <button
            (click)="refreshData()"
            [disabled]="loading$ | async"
            class="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50">
            Refresh Data
          </button>

          <button
            (click)="printDashboard()"
            class="inline-flex items-center px-4 py-2 rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700">
            Print
          </button>
        </div>
      </div>
    </div>
  `
})
export class DashboardComponent implements OnInit {
  timeInRangeData$: Observable<TimeInRangeData | null>;
  gmiData$: Observable<GMIData | null>;
  activePatients$: Observable<number | null>;
  dateRange$: Observable<{ startDate: string, endDate: string } | null>;
  lastUpdated$: Observable<string | null>;
  loading$: Observable<boolean>;
  error$: Observable<string | null>;

  selectedRange = 30;

  constructor(private store: Store) {
    this.timeInRangeData$ = this.store.select(ClinicSelectors.selectTimeInRangeData).pipe(map(d => d ?? null));
    this.gmiData$ = this.store.select(ClinicSelectors.selectGMIData).pipe(map(d => d ?? null));
    this.activePatients$ = this.store.select(ClinicSelectors.selectActivePatients).pipe(map(d => d ?? null));
    this.dateRange$ = this.store.select(ClinicSelectors.selectDateRange).pipe(map(d => d ?? null));
    this.lastUpdated$ = this.store.select(ClinicSelectors.selectLastUpdated).pipe(map(d => d ?? null));
    this.loading$ = this.store.select(ClinicSelectors.selectLoading);
    this.error$ = this.store.select(ClinicSelectors.selectError);
  }

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.store.dispatch(ClinicActions.loadAllClinicData());
  }

  refreshData(): void {
    this.loadData();
  }

  setDateRange(days: number): void {
    this.selectedRange = days;
    this.loadData();
  }

  printDashboard(): void {
    const printContents = document.getElementById('dashboard-content')?.innerHTML;
    if (!printContents) return;
    const win = window.open('', '', 'width=1000,height=800');
    if (win) {
      win.document.write(`
        <html>
          <head>
            <title>Clinic Outcomes Report</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              h1, h3 { color: #1f2937; }
              .chart { margin-bottom: 20px; }
            </style>
          </head>
          <body>${printContents}</body>
        </html>
      `);
      win.document.close();
      win.print();
    }
  }

  formatDateRange(startDate: string, endDate: string): string {
    const start = new Date(startDate);
    const end = new Date(endDate);
    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()}`;
  }

  formatLastUpdated(lastUpdated: string): string {
    return new Date(lastUpdated).toLocaleString();
  }
}
