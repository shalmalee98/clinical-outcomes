import { createFeatureSelector, createSelector } from '@ngrx/store';
import { ClinicState } from '../models/clinic.models';

export const selectClinicState = createFeatureSelector<ClinicState>('clinic');

export const selectClinicOutcomes = createSelector(
  selectClinicState,
  (state) => state.outcomes
);

export const selectTimeInRangeData = createSelector(
  selectClinicOutcomes,
  (outcomes) => outcomes?.timeInRange
);

export const selectGMIData = createSelector(
  selectClinicOutcomes,
  (outcomes) => outcomes?.gmi
);

export const selectActivePatients = createSelector(
  selectClinicOutcomes,
  (outcomes) => outcomes?.activePatients
);

export const selectDateRange = createSelector(
  selectClinicOutcomes,
  (outcomes) => outcomes?.dateRange
);

export const selectLastUpdated = createSelector(
  selectClinicOutcomes,
  (outcomes) => outcomes?.lastUpdated
);

export const selectLoading = createSelector(
  selectClinicState,
  (state) => state.loading
);

export const selectError = createSelector(
  selectClinicState,
  (state) => state.error
);