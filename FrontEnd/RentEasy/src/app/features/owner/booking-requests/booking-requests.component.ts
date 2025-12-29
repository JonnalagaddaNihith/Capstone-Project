import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTabsModule } from '@angular/material/tabs';
import { BookingService } from '../../../core/services/booking.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-booking-requests',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatTabsModule
  ],
  templateUrl: './booking-requests.component.html',
  styleUrl: './booking-requests.component.css'
})
export class BookingRequestsComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;
  processingId: number | null = null;

  constructor(
    private bookingService: BookingService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.isLoading = true;
    this.bookingService.getBookingsForMyProperties().subscribe({
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

  approveBooking(booking: Booking): void {
    this.updateStatus(booking, 'Approved');
  }

  rejectBooking(booking: Booking): void {
    this.updateStatus(booking, 'Rejected');
  }

  private updateStatus(booking: Booking, status: 'Approved' | 'Rejected'): void {
    this.processingId = booking.id;
    this.bookingService.updateBookingStatus(booking.id, { status }).subscribe({
      next: (response) => {
        this.processingId = null;
        if (response.success) {
          this.notificationService.success(`Booking ${status.toLowerCase()} successfully`);
          this.loadBookings();
        }
      },
      error: (error) => {
        this.processingId = null;
        this.notificationService.error(error.error?.message || 'Failed to update booking');
      }
    });
  }

  getDaysCount(booking: Booking): number {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    return Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
  }
}
