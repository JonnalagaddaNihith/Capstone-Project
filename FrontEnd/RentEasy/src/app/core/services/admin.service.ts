import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse } from '../../shared/models/user.model';

export interface AdminAnalytics {
  totalUsers: number;
  totalTenants: number;
  totalOwners: number;
  totalProperties: number;
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  rejectedBookings: number;
  recentUsers: Array<{
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
  }>;
  topOwners: Array<{
    id: number;
    name: string;
    email: string;
    propertyCount: number;
  }>;
  topTenants: Array<{
    id: number;
    name: string;
    email: string;
    bookingCount: number;
  }>;
}

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
  propertyCount: number;
  bookingCount: number;
}

export interface AdminProperty {
  id: number;
  owner_id: number;
  title: string;
  property_description: string;
  rent_per_day: number;
  location: string;
  amenities: string;
  photo1?: string;
  photo2?: string;
  photo3?: string;
  photo4?: string;
  owner_name: string;
  owner_email: string;
  bookingCount: number;
  approvedBookings: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private readonly API_URL = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getAnalytics(): Observable<ApiResponse<AdminAnalytics>> {
    return this.http.get<ApiResponse<AdminAnalytics>>(`${this.API_URL}/admin/analytics`);
  }

  getAllUsers(): Observable<ApiResponse<AdminUser[]>> {
    return this.http.get<ApiResponse<AdminUser[]>>(`${this.API_URL}/admin/users`);
  }

  getAllProperties(): Observable<ApiResponse<AdminProperty[]>> {
    return this.http.get<ApiResponse<AdminProperty[]>>(`${this.API_URL}/admin/properties`);
  }

  deleteProperty(propertyId: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/admin/properties/${propertyId}`);
  }
}
