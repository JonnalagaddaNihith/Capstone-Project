import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSliderModule } from '@angular/material/slider';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../../core/services/property.service';
import { Property, PropertyFilters } from '../../../shared/models/property.model';

@Component({
  selector: 'app-property-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatSliderModule,
    PropertyCardComponent
  ],
  templateUrl: './property-list.component.html',
  styleUrl: './property-list.component.css'
})
export class PropertyListComponent implements OnInit {
  properties: Property[] = [];
  filteredProperties: Property[] = [];
  isLoading = true;
  
  // Filters
  filters: PropertyFilters = {};
  locationSearch = '';
  minRent: number | null = null;
  maxRent: number | null = null;
  amenitySearch = '';

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getAllProperties(this.buildFilters()).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties = response.data;
          this.filteredProperties = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  buildFilters(): PropertyFilters {
    const filters: PropertyFilters = {};
    if (this.locationSearch) {
      filters.location = this.locationSearch;
    }
    if (this.minRent !== null) {
      filters.min_rent = this.minRent;
    }
    if (this.maxRent !== null) {
      filters.max_rent = this.maxRent;
    }
    if (this.amenitySearch) {
      filters.amenities = this.amenitySearch;
    }
    return filters;
  }

  applyFilters(): void {
    this.loadProperties();
  }

  clearFilters(): void {
    this.locationSearch = '';
    this.minRent = null;
    this.maxRent = null;
    this.amenitySearch = '';
    this.loadProperties();
  }
}
