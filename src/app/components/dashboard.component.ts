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
    <div class="min-h-screen bg-gray-50 p-8">
      <div class="max-w-7xl mx-auto" id="dashboard-content">

        <!-- Header -->
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-2xl font-semibold text-gray-900">Clinic Outcomes</h1>

          <!-- Print button -->
          <button
            (click)="printDashboard()"
            class="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded-full hover:bg-blue-50">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M6 9V2h12v7M6 18h12v4H6v-4zM6 14h12v4H6v-4z" />
            </svg>
            Print
          </button>
        </div>

        <!-- Range selectors -->
        <div class="flex gap-3 mb-4">
          <button
            (click)="setDateRange(30)"
            [class.bg-blue-600]="selectedRange === 30"
            [class.text-white]="selectedRange === 30"
            class="px-4 py-1 rounded-full border text-sm font-medium text-gray-700 hover:bg-blue-100">
            30 days
          </button>
          <button
            (click)="setDateRange(60)"
            [class.bg-blue-600]="selectedRange === 60"
            [class.text-white]="selectedRange === 60"
            class="px-4 py-1 rounded-full border text-sm font-medium text-gray-700 hover:bg-blue-100">
            60 days
          </button>
          <button
            (click)="setDateRange(90)"
            [class.bg-blue-600]="selectedRange === 90"
            [class.text-white]="selectedRange === 90"
            class="px-4 py-1 rounded-full border text-sm font-medium text-gray-700 hover:bg-blue-100">
            90 days
          </button>
        </div>

        <!-- Date & Info Row -->
        <div class="mb-1 text-sm text-gray-700">
          <ng-container *ngIf="dateRange$ | async as dateRange">
            Showing {{ activePatients$ | async }} patients from last {{ selectedRange }} days
            of available data from {{ formatDateRange(dateRange.startDate, dateRange.endDate) }}
          </ng-container>
        </div>

        <!-- Info note -->
        <div class="mb-6 text-xs italic text-gray-500">
          Only patients with a minimum of 10 days of SG data are included.
          <ng-container *ngIf="lastUpdated$ | async as lastUpdated">
            Last updated on {{ formatLastUpdated(lastUpdated) }}
          </ng-container>
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
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <app-time-in-range-chart [data]="timeInRangeData$ | async"></app-time-in-range-chart>
          <app-gmi-chart [data]="gmiData$ | async"></app-gmi-chart>
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
    this.store.dispatch(ClinicActions.loadAllClinicData({ range: this.selectedRange }));
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
