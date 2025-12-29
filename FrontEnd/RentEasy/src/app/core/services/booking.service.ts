import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Booking, BookingCreateRequest, BookingStatusUpdateRequest } from '../../shared/models/booking.model';
import { ApiResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private readonly API_URL = `${environment.apiUrl}/bookings`;

  constructor(private http: HttpClient) {}

  createBooking(bookingData: BookingCreateRequest): Observable<ApiResponse<Booking>> {
    return this.http.post<ApiResponse<Booking>>(this.API_URL, bookingData);
  }

  getMyBookings(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.API_URL}/tenant/me`);
  }

  getBookingsForMyProperties(): Observable<ApiResponse<Booking[]>> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.API_URL}/owner/me`);
  }

  updateBookingStatus(id: number, status: BookingStatusUpdateRequest): Observable<ApiResponse<Booking>> {
    return this.http.patch<ApiResponse<Booking>>(`${this.API_URL}/${id}/status`, status);
  }

  cancelBooking(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}/cancel`);
  }
}
