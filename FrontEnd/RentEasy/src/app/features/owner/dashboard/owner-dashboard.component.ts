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

  /**
   * Get only upcoming or current approved bookings (check_out >= today)
   */
  get upcomingApprovedBookings(): Booking[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return this.approvedBookings.filter(b => {
      const checkOut = new Date(b.check_out);
      return checkOut >= today;
    });
  }

  /**
   * Calculate revenue for a single booking
   */
  private calculateBookingRevenue(booking: Booking): number {
    const checkIn = new Date(booking.check_in);
    const checkOut = new Date(booking.check_out);
    const diffMs = checkOut.getTime() - checkIn.getTime();
    const diffHours = diffMs / (1000 * 60 * 60);
    const days = Math.ceil(diffHours / 24);
    return (booking.property_rent_per_day || 0) * days;
  }

  /**
   * Total estimated revenue from upcoming/current approved bookings
   */
  get totalRevenue(): number {
    return this.upcomingApprovedBookings.reduce((sum, b) => {
      return sum + this.calculateBookingRevenue(b);
    }, 0);
  }

  /**
   * Revenue breakdown by property for upcoming/current approved bookings
   */
  get revenueByProperty(): { propertyTitle: string; propertyId: number; revenue: number; bookingCount: number }[] {
    const revenueMap = new Map<number, { propertyTitle: string; revenue: number; bookingCount: number }>();
    
    for (const booking of this.upcomingApprovedBookings) {
      const propertyId = booking.property_id;
      const revenue = this.calculateBookingRevenue(booking);
      
      if (revenueMap.has(propertyId)) {
        const existing = revenueMap.get(propertyId)!;
        existing.revenue += revenue;
        existing.bookingCount += 1;
      } else {
        revenueMap.set(propertyId, {
          propertyTitle: booking.property_title || 'Unknown Property',
          revenue: revenue,
          bookingCount: 1
        });
      }
    }
    
    // Convert to array and sort by revenue descending
    return Array.from(revenueMap.entries())
      .map(([propertyId, data]) => ({
        propertyId,
        propertyTitle: data.propertyTitle,
        revenue: data.revenue,
        bookingCount: data.bookingCount
      }))
      .sort((a, b) => b.revenue - a.revenue);
  }
}
