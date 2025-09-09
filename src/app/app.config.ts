import { ApplicationConfig, importProvidersFrom, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { BaseChartDirective } from 'ng2-charts';

import { routes } from './app.routes';
import { clinicReducer } from './store/clinic.reducer';
import { ClinicEffects } from './store/clinic.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideStore({ clinic: clinicReducer }),
    provideEffects([ClinicEffects]),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: !isDevMode(),
    }),
    importProvidersFrom(BaseChartDirective)
  ]
};