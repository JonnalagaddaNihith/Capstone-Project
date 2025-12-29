import { createAction, props } from '@ngrx/store';
import { Booking, BookingCreateRequest, BookingStatusUpdateRequest } from '../../shared/models/booking.model';

// Load Tenant Bookings
export const loadMyBookings = createAction('[Bookings] Load My Bookings');

export const loadMyBookingsSuccess = createAction(
  '[Bookings] Load My Bookings Success',
  props<{ bookings: Booking[] }>()
);

export const loadMyBookingsFailure = createAction(
  '[Bookings] Load My Bookings Failure',
  props<{ error: string }>()
);

// Load Owner Bookings (for property owners)
export const loadOwnerBookings = createAction('[Bookings] Load Owner Bookings');

export const loadOwnerBookingsSuccess = createAction(
  '[Bookings] Load Owner Bookings Success',
  props<{ bookings: Booking[] }>()
);

export const loadOwnerBookingsFailure = createAction(
  '[Bookings] Load Owner Bookings Failure',
  props<{ error: string }>()
);

// Create Booking
export const createBooking = createAction(
  '[Bookings] Create Booking',
  props<{ booking: BookingCreateRequest }>()
);

export const createBookingSuccess = createAction(
  '[Bookings] Create Booking Success',
  props<{ booking: Booking }>()
);

export const createBookingFailure = createAction(
  '[Bookings] Create Booking Failure',
  props<{ error: string }>()
);

// Update Booking Status (Approve/Reject)
export const updateBookingStatus = createAction(
  '[Bookings] Update Booking Status',
  props<{ id: number; status: BookingStatusUpdateRequest }>()
);

export const updateBookingStatusSuccess = createAction(
  '[Bookings] Update Booking Status Success',
  props<{ booking: Booking }>()
);

export const updateBookingStatusFailure = createAction(
  '[Bookings] Update Booking Status Failure',
  props<{ error: string }>()
);

// Cancel Booking
export const cancelBooking = createAction(
  '[Bookings] Cancel Booking',
  props<{ id: number }>()
);

export const cancelBookingSuccess = createAction(
  '[Bookings] Cancel Booking Success',
  props<{ id: number }>()
);

export const cancelBookingFailure = createAction(
  '[Bookings] Cancel Booking Failure',
  props<{ error: string }>()
);

// Clear Error
export const clearBookingsError = createAction('[Bookings] Clear Error');
