import { createReducer, on } from '@ngrx/store';
import { ClinicState } from '../models/clinic.models';
import * as ClinicActions from './clinic.actions';

export const initialState: ClinicState = {
  outcomes: null,
  loading: false,
  error: null,
};

export const clinicReducer = createReducer(
  initialState,
  
  // Load All Data
  on(ClinicActions.loadAllClinicData, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  
  on(ClinicActions.loadAllClinicDataSuccess, (state, { outcomes }) => ({
    ...state,
    outcomes,
    loading: false,
    error: null,
  })),
  
  on(ClinicActions.loadAllClinicDataFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // Time in Range
  on(ClinicActions.loadTimeInRange, (state) => ({
    ...state,
    loading: true,
  })),
  
  on(ClinicActions.loadTimeInRangeSuccess, (state, { data }) => ({
    ...state,
    outcomes: state.outcomes ? {
      ...state.outcomes,
      timeInRange: data
    } : null,
    loading: false,
  })),
  
  on(ClinicActions.loadTimeInRangeFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),
  
  // GMI
  on(ClinicActions.loadGMI, (state) => ({
    ...state,
    loading: true,
  })),
  
  on(ClinicActions.loadGMISuccess, (state, { data }) => ({
    ...state,
    outcomes: state.outcomes ? {
      ...state.outcomes,
      gmi: data
    } : null,
    loading: false,
  })),
  
  on(ClinicActions.loadGMIFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);