import { createFeatureSelector, createSelector } from '@ngrx/store';
import { BookingsState, bookingsAdapter } from './bookings.reducer';

export const selectBookingsState = createFeatureSelector<BookingsState>('bookings');

// Entity Adapter Selectors
const { selectIds, selectEntities, selectAll, selectTotal } = bookingsAdapter.getSelectors();

export const selectBookingIds = createSelector(
  selectBookingsState,
  selectIds
);

export const selectBookingEntities = createSelector(
  selectBookingsState,
  selectEntities
);

export const selectAllBookings = createSelector(
  selectBookingsState,
  selectAll
);

export const selectBookingsTotal = createSelector(
  selectBookingsState,
  selectTotal
);

export const selectBookingsLoading = createSelector(
  selectBookingsState,
  (state) => state.isLoading
);

export const selectBookingsError = createSelector(
  selectBookingsState,
  (state) => state.error
);

// Filter by Status
export const selectPendingBookings = createSelector(
  selectAllBookings,
  (bookings) => bookings.filter(b => b.status === 'Pending')
);

export const selectApprovedBookings = createSelector(
  selectAllBookings,
  (bookings) => bookings.filter(b => b.status === 'Approved')
);

export const selectRejectedBookings = createSelector(
  selectAllBookings,
  (bookings) => bookings.filter(b => b.status === 'Rejected')
);

// Recent Bookings (first 5)
export const selectRecentBookings = createSelector(
  selectAllBookings,
  (bookings) => bookings.slice(0, 5)
);

// Booking by ID
export const selectBookingById = (id: number) =>
  createSelector(
    selectBookingEntities,
    (entities) => entities[id]
  );
