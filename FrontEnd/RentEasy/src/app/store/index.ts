import { isDevMode } from '@angular/core';
import { ActionReducerMap, MetaReducer } from '@ngrx/store';

import { AuthState, authReducer } from './auth/auth.reducer';
import { PropertiesState, propertiesReducer } from './properties/properties.reducer';
import { BookingsState, bookingsReducer } from './bookings/bookings.reducer';

// Root State Interface
export interface AppState {
  auth: AuthState;
  properties: PropertiesState;
  bookings: BookingsState;
}

// Root Reducers
export const reducers: ActionReducerMap<AppState> = {
  auth: authReducer,
  properties: propertiesReducer,
  bookings: bookingsReducer
};

// Meta Reducers (for dev logging, etc.)
export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];

// Re-export selectors for convenience
export * from './auth/auth.selectors';
export * from './properties/properties.selectors';
export * from './bookings/bookings.selectors';

// Re-export actions for convenience
export * as AuthActions from './auth/auth.actions';
export * as PropertiesActions from './properties/properties.actions';
export * as BookingsActions from './bookings/bookings.actions';
