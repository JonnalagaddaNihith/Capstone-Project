import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Property, PropertyCreateRequest, PropertyUpdateRequest, PropertyFilters } from '../../shared/models/property.model';
import { ApiResponse } from '../../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class PropertyService {
  private readonly API_URL = `${environment.apiUrl}/properties`;

  constructor(private http: HttpClient) {}

  getAllProperties(filters?: PropertyFilters): Observable<ApiResponse<Property[]>> {
    let params = new HttpParams();
    
    if (filters) {
      if (filters.location) {
        params = params.set('location', filters.location);
      }
      if (filters.min_rent !== undefined) {
        params = params.set('min_rent', filters.min_rent.toString());
      }
      if (filters.max_rent !== undefined) {
        params = params.set('max_rent', filters.max_rent.toString());
      }
      if (filters.amenities) {
        params = params.set('amenities', filters.amenities);
      }
    }

    return this.http.get<ApiResponse<Property[]>>(this.API_URL, { params });
  }

  getPropertyById(id: number): Observable<ApiResponse<Property>> {
    return this.http.get<ApiResponse<Property>>(`${this.API_URL}/${id}`);
  }

  getMyProperties(): Observable<ApiResponse<Property[]>> {
    return this.http.get<ApiResponse<Property[]>>(`${this.API_URL}/owner/me`);
  }

  createProperty(propertyData: PropertyCreateRequest): Observable<ApiResponse<Property>> {
    return this.http.post<ApiResponse<Property>>(this.API_URL, propertyData);
  }

  updateProperty(id: number, updates: PropertyUpdateRequest): Observable<ApiResponse<Property>> {
    return this.http.put<ApiResponse<Property>>(`${this.API_URL}/${id}`, updates);
  }

  deleteProperty(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.API_URL}/${id}`);
  }
}
