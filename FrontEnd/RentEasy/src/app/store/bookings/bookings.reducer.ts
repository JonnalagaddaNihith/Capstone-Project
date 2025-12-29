import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Booking } from '../../shared/models/booking.model';
import * as BookingsActions from './bookings.actions';

export interface BookingsState extends EntityState<Booking> {
  isLoading: boolean;
  error: string | null;
}

export const bookingsAdapter: EntityAdapter<Booking> = createEntityAdapter<Booking>({
  selectId: (booking) => booking.id,
  sortComparer: (a, b) => new Date(b.request_time || 0).getTime() - new Date(a.request_time || 0).getTime()
});

export const initialState: BookingsState = bookingsAdapter.getInitialState({
  isLoading: false,
  error: null
});

export const bookingsReducer = createReducer(
  initialState,

  // Load My Bookings (Tenant)
  on(BookingsActions.loadMyBookings, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(BookingsActions.loadMyBookingsSuccess, (state, { bookings }) =>
    bookingsAdapter.setAll(bookings, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(BookingsActions.loadMyBookingsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Load Owner Bookings
  on(BookingsActions.loadOwnerBookings, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(BookingsActions.loadOwnerBookingsSuccess, (state, { bookings }) =>
    bookingsAdapter.setAll(bookings, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(BookingsActions.loadOwnerBookingsFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Create Booking
  on(BookingsActions.createBooking, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(BookingsActions.createBookingSuccess, (state, { booking }) =>
    bookingsAdapter.addOne(booking, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(BookingsActions.createBookingFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Update Booking Status
  on(BookingsActions.updateBookingStatus, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(BookingsActions.updateBookingStatusSuccess, (state, { booking }) =>
    bookingsAdapter.updateOne(
      { id: booking.id, changes: booking },
      {
        ...state,
        isLoading: false,
        error: null
      }
    )
  ),

  on(BookingsActions.updateBookingStatusFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Cancel Booking
  on(BookingsActions.cancelBooking, (state) => ({
    ...state,
    isLoading: true,
    error: null
  })),

  on(BookingsActions.cancelBookingSuccess, (state, { id }) =>
    bookingsAdapter.removeOne(id, {
      ...state,
      isLoading: false,
      error: null
    })
  ),

  on(BookingsActions.cancelBookingFailure, (state, { error }) => ({
    ...state,
    isLoading: false,
    error
  })),

  // Clear Error
  on(BookingsActions.clearBookingsError, (state) => ({
    ...state,
    error: null
  }))
);
