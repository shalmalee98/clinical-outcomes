import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { map, switchMap, catchError, tap } from 'rxjs/operators';
import { ClinicService } from '../services/clinic.service';
import * as ClinicActions from './clinic.actions';

@Injectable()
export class ClinicEffects {
  private actions$ = inject(Actions);
  private clinicService = inject(ClinicService);

  constructor() {
    // Log in constructor to check if effect is initialized
    console.log('ClinicEffects initialized');
    console.log('actions$:', this.actions$);
    console.log('clinicService:', this.clinicService);
  }
  
  loadTimeInRange$ = createEffect(() => {
    console.log('loadTimeInRange$ effect created', this.clinicService);
    return this.actions$.pipe(
      ofType(ClinicActions.loadTimeInRange),
      tap(action => console.log('loadTimeInRange action received:', action)),
      switchMap(() => {
        console.log('About to call getTimeInRangeData');
        return this.clinicService.getTimeInRangeData().pipe(
          tap(data => console.log('Time in Range data received:', data)),
          map(data => {
            console.log('Mapping to success action:', data);
            return ClinicActions.loadTimeInRangeSuccess({ data });
          }),
          catchError(error => {
            console.error('Error in loadTimeInRange:', error);
            return of(ClinicActions.loadTimeInRangeFailure({ 
              error: error?.message || 'Failed to load Time in Range data' 
            }));
          })
        )
      })
    );
  });

  loadGMI$ = createEffect(() => {
    console.log('loadGMI$ effect created');
    return this.actions$.pipe(
      ofType(ClinicActions.loadGMI),
      tap(action => console.log('loadGMI action received:', action)),
      switchMap(() => {
        console.log('About to call getGMIData');
        return this.clinicService.getGMIData().pipe(
          tap(data => console.log('GMI data received:', data)),
          map(data => {
            console.log('Mapping GMI to success action:', data);
            return ClinicActions.loadGMISuccess({ data });
          }),
          catchError(error => {
            console.error('Error in loadGMI:', error);
            return of(ClinicActions.loadGMIFailure({ 
              error: error?.message || 'Failed to load GMI data' 
            }));
          })
        )
      })
    );
  });

  loadAllClinicData$ = createEffect(() => {
    console.log('loadAllClinicData$ effect created');
    return this.actions$.pipe(
      ofType(ClinicActions.loadAllClinicData),
      tap(action => console.log('loadAllClinicData action received:', action)),
      switchMap(() => {
        console.log('About to call getAllClinicData');
        return this.clinicService.getAllClinicData().pipe(
          tap(outcomes => console.log('All clinic data received:', outcomes)),
          map(outcomes => {
            console.log('Mapping all data to success action:', outcomes);
            return ClinicActions.loadAllClinicDataSuccess({ outcomes });
          }),
          catchError(error => {
            console.error('Error in loadAllClinicData:', error);
            return of(ClinicActions.loadAllClinicDataFailure({ 
              error: error?.message || 'Failed to load clinic data' 
            }));
          })
        )
      })
    );
  });
}