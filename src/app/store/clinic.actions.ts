import { createAction, props } from '@ngrx/store';
import { TimeInRangeData, GMIData, ClinicOutcomes } from '../models/clinic.models';

// Time in Range Actions
export const loadTimeInRange = createAction('[Clinic] Load Time in Range');
export const loadTimeInRangeSuccess = createAction(
  '[Clinic] Load Time in Range Success',
  props<{ data: TimeInRangeData }>()
);
export const loadTimeInRangeFailure = createAction(
  '[Clinic] Load Time in Range Failure',
  props<{ error: string }>()
);

// GMI Actions
export const loadGMI = createAction('[Clinic] Load GMI');
export const loadGMISuccess = createAction(
  '[Clinic] Load GMI Success',
  props<{ data: GMIData }>()
);
export const loadGMIFailure = createAction(
  '[Clinic] Load GMI Failure',
  props<{ error: string }>()
);

// Combined Actions
export const loadAllClinicData = createAction('[Clinic] Load All Data');
export const loadAllClinicDataSuccess = createAction(
  '[Clinic] Load All Data Success',
  props<{ outcomes: ClinicOutcomes }>()
);
export const loadAllClinicDataFailure = createAction(
  '[Clinic] Load All Data Failure',
  props<{ error: string }>()
);