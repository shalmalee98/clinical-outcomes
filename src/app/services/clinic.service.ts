import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TimeInRangeData, GMIData, ClinicOutcomes } from '../models/clinic.models';

@Injectable({
  providedIn: 'root'
})
export class ClinicService {
  
  constructor(private http: HttpClient) {
    console.log('ClinicService created');
  }

  // Mock API call A - Time in Range Data
  getTimeInRangeData(): Observable<TimeInRangeData> {
    console.log('getTimeInRangeData called');
    const mockData: TimeInRangeData = {
      veryHigh: 5.2, // >250 mg/dL
      high: 12.8, // 181-250 mg/dL  
      target: 68.5, // 70-180 mg/dL (target range)
      low: 8.3, // 54-69 mg/dL
      veryLow: 5.2  // <54 mg/dL
    };
    
    // Simulate HTTP delay
    return of(mockData).pipe(delay(1000));
  }

  // Mock API call B - GMI Data
  getGMIData(): Observable<GMIData> {
    console.log('getGMIData called');
    const mockData: GMIData = {
      percentage: 7.2,
      category: 'Good',
      targetRange: '6.5-7.0%'
    };
    
    // Simulate HTTP delay
    return of(mockData).pipe(delay(800));
  }

  // Combined API call for all clinic data
  getAllClinicData(): Observable<ClinicOutcomes> {
    console.log('getAllClinicData called');
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
    
    const mockData: ClinicOutcomes = {
      timeInRange: {
        veryHigh: 5.2,
        high: 12.8,
        target: 68.5,
        low: 8.3,
        veryLow: 5.2
      },
      gmi: {
        percentage: 7.2,
        category: 'Good',
        targetRange: '6.5-7.0%'
      },
      activePatients: 245,
      dateRange: {
        startDate: thirtyDaysAgo.toISOString(),
        endDate: now.toISOString()
      },
      lastUpdated: now.toISOString()
    };
    
    // Simulate HTTP delay
    return of(mockData).pipe(delay(1500));
  }
}