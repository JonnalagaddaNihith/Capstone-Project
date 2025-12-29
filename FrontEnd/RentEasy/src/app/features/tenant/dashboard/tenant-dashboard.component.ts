import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../core/services/auth.service';
import { BookingService } from '../../../core/services/booking.service';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-tenant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './tenant-dashboard.component.html',
  styleUrl: './tenant-dashboard.component.css'
})
export class TenantDashboardComponent implements OnInit {
  bookings: Booking[] = [];
  isLoading = true;

  constructor(
    public authService: AuthService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.bookingService.getMyBookings().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.bookings = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get pendingBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'Pending');
  }

  get approvedBookings(): Booking[] {
    return this.bookings.filter(b => b.status === 'Approved');
  }

  get recentBookings(): Booking[] {
    return this.bookings.slice(0, 5);
  }
}
