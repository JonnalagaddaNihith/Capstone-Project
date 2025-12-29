import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PropertyCardComponent } from '../../../shared/components/property-card/property-card.component';
import { PropertyService } from '../../../core/services/property.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Property } from '../../../shared/models/property.model';

@Component({
  selector: 'app-my-properties',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDialogModule,
    PropertyCardComponent
  ],
  templateUrl: './my-properties.component.html',
  styleUrl: './my-properties.component.css'
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  isLoading = true;

  constructor(
    private propertyService: PropertyService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.isLoading = true;
    this.propertyService.getMyProperties().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load properties');
      }
    });
  }

  onEditProperty(property: Property): void {
    this.router.navigate(['/owner/properties', property.id, 'edit']);
  }

  onDeleteProperty(property: Property): void {
    if (confirm(`Are you sure you want to delete "${property.title}"?`)) {
      this.propertyService.deleteProperty(property.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.notificationService.success('Property deleted successfully');
            this.loadProperties();
          }
        },
        error: (error) => {
          this.notificationService.error(error.error?.message || 'Failed to delete property');
        }
      });
    }
  }
}
