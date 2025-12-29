import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  templateUrl: './my-bookings.component.html',
})
export class MyBookingsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;
  cancellingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getMyBookings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.bookings = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load bookings');
      }
    });
  }

  get pendingBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'Pending');
  }

  get approvedBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'Approved');
  }

  get rejectedBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'Rejected');
  }

  cancelBooking(booking: Booking): void {
    if (confirm('Are you sure you want to cancel this booking?')) {
      this.cancellingId = booking.id;
      this.bookingService.cancelBooking(booking.id).subscribe({
        next: (response) => {
          this.cancellingId = null;
          if (response.success) {
            this.notificationService.success('Booking cancelled successfully');
            this.loadBookings();
          }
        },
        error: (error) => {
          this.cancellingId = null;
          this.notificationService.error(error.error?.message || 'Failed to cancel booking');
        }
      });
    }
  }

  getDays(booking: Booking): number {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }
}
