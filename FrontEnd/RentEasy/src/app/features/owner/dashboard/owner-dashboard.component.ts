import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { AuthService } from '../../../core/services/auth.service';
import { PropertyService } from '../../../core/services/property.service';
import { BookingService } from '../../../core/services/booking.service';
import { Property } from '../../../shared/models/property.model';
import { Booking } from '../../../shared/models/booking.model';

@Component({
  selector: 'app-owner-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule
  ],
  templateUrl: './owner-dashboard.component.html'
})
export class OwnerDashboardComponent implements OnInit {
  properties: Property[] = [];
  bookings: Booking[] = [];
  isLoading = true;

  constructor(
    public authService: AuthService,
    private propertyService: PropertyService,
    private bookingService: BookingService
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.propertyService.getMyProperties().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties = response.data;
        }
      }
    });

    this.bookingService.getBookingsForMyProperties().subscribe({
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

  get totalRevenue(): number {
    return this.approvedBookings.reduce((sum, b) => {
      const checkIn = new Date(b.check_in);
      const checkOut = new Date(b.check_out);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + (b.property_rent_per_day || 0) * days;
    }, 0);
  }
}
