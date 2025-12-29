import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map, exhaustMap, catchError, tap } from 'rxjs/operators';
import { BookingService } from '../../core/services/booking.service';
import { NotificationService } from '../../core/services/notification.service';
import * as BookingsActions from './bookings.actions';

@Injectable()
export class BookingsEffects {
  private actions$ = inject(Actions);
  private bookingService = inject(BookingService);
  private router = inject(Router);
  private notificationService = inject(NotificationService);

  loadMyBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.loadMyBookings),
      exhaustMap(() =>
        this.bookingService.getMyBookings().pipe(
          map((response) => {
            if (response.success && response.data) {
              return BookingsActions.loadMyBookingsSuccess({ bookings: response.data });
            }
            return BookingsActions.loadMyBookingsFailure({ error: response.message || 'Failed to load bookings' });
          }),
          catchError((error) =>
            of(BookingsActions.loadMyBookingsFailure({ error: error.error?.message || 'Failed to load bookings' }))
          )
        )
      )
    )
  );

  loadOwnerBookings$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.loadOwnerBookings),
      exhaustMap(() =>
        this.bookingService.getBookingsForMyProperties().pipe(
          map((response) => {
            if (response.success && response.data) {
              return BookingsActions.loadOwnerBookingsSuccess({ bookings: response.data });
            }
            return BookingsActions.loadOwnerBookingsFailure({ error: response.message || 'Failed to load bookings' });
          }),
          catchError((error) =>
            of(BookingsActions.loadOwnerBookingsFailure({ error: error.error?.message || 'Failed to load bookings' }))
          )
        )
      )
    )
  );

  createBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.createBooking),
      exhaustMap(({ booking }) =>
        this.bookingService.createBooking(booking).pipe(
          map((response) => {
            if (response.success && response.data) {
              return BookingsActions.createBookingSuccess({ booking: response.data });
            }
            return BookingsActions.createBookingFailure({ error: response.message || 'Failed to create booking' });
          }),
          catchError((error) =>
            of(BookingsActions.createBookingFailure({ error: error.error?.message || 'Failed to create booking' }))
          )
        )
      )
    )
  );

  createBookingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.createBookingSuccess),
        tap(() => {
          this.notificationService.success('Booking request submitted successfully!');
          this.router.navigate(['/tenant/bookings']);
        })
      ),
    { dispatch: false }
  );

  updateBookingStatus$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.updateBookingStatus),
      exhaustMap(({ id, status }) =>
        this.bookingService.updateBookingStatus(id, status).pipe(
          map((response) => {
            if (response.success && response.data) {
              return BookingsActions.updateBookingStatusSuccess({ booking: response.data });
            }
            return BookingsActions.updateBookingStatusFailure({ error: response.message || 'Failed to update booking' });
          }),
          catchError((error) =>
            of(BookingsActions.updateBookingStatusFailure({ error: error.error?.message || 'Failed to update booking' }))
          )
        )
      )
    )
  );

  updateBookingStatusSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.updateBookingStatusSuccess),
        tap(({ booking }) => {
          this.notificationService.success(`Booking ${booking.status?.toLowerCase()} successfully!`);
        })
      ),
    { dispatch: false }
  );

  cancelBooking$ = createEffect(() =>
    this.actions$.pipe(
      ofType(BookingsActions.cancelBooking),
      exhaustMap(({ id }) =>
        this.bookingService.cancelBooking(id).pipe(
          map((response) => {
            if (response.success) {
              return BookingsActions.cancelBookingSuccess({ id });
            }
            return BookingsActions.cancelBookingFailure({ error: response.message || 'Failed to cancel booking' });
          }),
          catchError((error) =>
            of(BookingsActions.cancelBookingFailure({ error: error.error?.message || 'Failed to cancel booking' }))
          )
        )
      )
    )
  );

  cancelBookingSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(BookingsActions.cancelBookingSuccess),
        tap(() => {
          this.notificationService.success('Booking cancelled successfully!');
        })
      ),
    { dispatch: false }
  );

  bookingFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(
          BookingsActions.loadMyBookingsFailure,
          BookingsActions.loadOwnerBookingsFailure,
          BookingsActions.createBookingFailure,
          BookingsActions.updateBookingStatusFailure,
          BookingsActions.cancelBookingFailure
        ),
        tap(({ error }) => {
          this.notificationService.error(error);
        })
      ),
    { dispatch: false }
  );
}
