export interface TimeInRangeData {
  veryHigh: number; // >250 mg/dL
  high: number; // 181-250 mg/dL
  target: number; // 70-180 mg/dL
  low: number; // 54-69 mg/dL
  veryLow: number; // <54 mg/dL
}

export interface GMIData {
  percentage: number;
  category: 'Excellent' | 'Good' | 'Fair' | 'Poor';
  targetRange: string;
}

export interface ClinicOutcomes {
  timeInRange: TimeInRangeData;
  gmi: GMIData;
  activePatients: number;
  dateRange: {
    startDate: string;
    endDate: string;
  };
  lastUpdated: string;
}

export interface ClinicState {
  outcomes: ClinicOutcomes | null;
  loading: boolean;
  error: string | null;
}