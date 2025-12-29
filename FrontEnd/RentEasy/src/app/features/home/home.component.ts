import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { PropertyCardComponent } from '../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../core/services/property.service';
import { Property } from '../../shared/models/property.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    PropertyCardComponent
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  featuredProperties: Property[] = [];
  isLoading = true;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.loadFeaturedProperties();
  }

  loadFeaturedProperties(): void {
    this.propertyService.getAllProperties().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.featuredProperties = response.data.slice(0, 6);
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
