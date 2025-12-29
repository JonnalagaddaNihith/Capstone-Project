import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatNativeDateModule } from '@angular/material/core';
import { PropertyService } from '../../../core/services/property.service';
import { BookingService } from '../../../core/services/booking.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Property } from '../../../shared/models/property.model';

@Component({
  selector: 'app-property-details',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    MatNativeDateModule
  ],
  templateUrl: './property-details.component.html'
})
export class PropertyDetailsComponent implements OnInit {
  property: Property | null = null;
  isLoading = true;
  currentImageIndex = 0;
  
  // Booking
  checkIn: Date | null = null;
  checkOut: Date | null = null;
  isBooking = false;
  minDate = new Date();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private bookingService: BookingService,
    public authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProperty(parseInt(id, 10));
    }
  }

  loadProperty(id: number): void {
    this.propertyService.getPropertyById(id).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.property = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load property');
      }
    });
  }

  get photos(): string[] {
    if (!this.property) return [];
    const photos: string[] = [];
    if (this.property.photo1) photos.push(this.property.photo1);
    if (this.property.photo2) photos.push(this.property.photo2);
    if (this.property.photo3) photos.push(this.property.photo3);
    if (this.property.photo4) photos.push(this.property.photo4);
    return photos;
  }

  get amenitiesList(): string[] {
    if (!this.property?.amenities) return [];
    return this.property.amenities.split(',').map(a => a.trim()).filter(a => a);
  }

  get totalDays(): number {
    if (!this.checkIn || !this.checkOut) return 0;
    const diff = this.checkOut.getTime() - this.checkIn.getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }

  get totalPrice(): number {
    if (!this.property) return 0;
    return this.totalDays * this.property.rent_per_day;
  }

  selectImage(index: number): void {
    this.currentImageIndex = index;
  }

  nextImage(): void {
    if (this.photos.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.photos.length;
    }
  }

  prevImage(): void {
    if (this.photos.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.photos.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  bookProperty(): void {
    if (!this.authService.isAuthenticated()) {
      this.notificationService.warning('Please login to book this property');
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    if (!this.authService.isTenant()) {
      this.notificationService.warning('Only tenants can book properties');
      return;
    }

    if (!this.checkIn || !this.checkOut) {
      this.notificationService.warning('Please select check-in and check-out dates');
      return;
    }

    if (this.checkIn >= this.checkOut) {
      this.notificationService.warning('Check-out date must be after check-in date');
      return;
    }

    this.isBooking = true;
    this.bookingService.createBooking({
      property_id: this.property!.id,
      check_in: this.checkIn.toISOString(),
      check_out: this.checkOut.toISOString()
    }).subscribe({
      next: (response) => {
        this.isBooking = false;
        if (response.success) {
          this.notificationService.success('Booking request submitted successfully!');
          this.router.navigate(['/tenant/bookings']);
        } else {
          this.notificationService.error(response.message || 'Booking failed');
        }
      },
      error: (error) => {
        this.isBooking = false;
        this.notificationService.error(error.error?.message || 'Booking failed. Please try again.');
      }
    });
  }
}
