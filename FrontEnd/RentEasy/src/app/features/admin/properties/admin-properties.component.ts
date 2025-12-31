import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { AdminService, AdminProperty } from '../../../core/services/admin.service';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-admin-properties',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    MatDialogModule
  ],
  templateUrl: './admin-properties.component.html',
  styleUrl: './admin-properties.component.css'
})
export class AdminPropertiesComponent implements OnInit {
  properties: AdminProperty[] = [];
  isLoading = true;
  deletingId: number | null = null;
  showDeleteModal = false;
  propertyToDelete: AdminProperty | null = null;

  constructor(
    private adminService: AdminService,
    private authService: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.loadProperties();
  }

  loadProperties(): void {
    this.adminService.getAllProperties().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.properties = response.data;
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  get totalBookings(): number {
    return this.properties.reduce((sum, p) => sum + p.bookingCount, 0);
  }

  get approvedBookings(): number {
    return this.properties.reduce((sum, p) => sum + p.approvedBookings, 0);
  }

  confirmDelete(property: AdminProperty): void {
    this.propertyToDelete = property;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.propertyToDelete = null;
  }

  deleteProperty(): void {
    if (!this.propertyToDelete) return;

    this.deletingId = this.propertyToDelete.id;
    this.showDeleteModal = false;

    this.adminService.deleteProperty(this.propertyToDelete.id).subscribe({
      next: (response) => {
        if (response.success) {
          this.properties = this.properties.filter(p => p.id !== this.deletingId);
          this.notificationService.success('Property deleted successfully');
        } else {
          this.notificationService.error(response.message || 'Failed to delete property');
        }
        this.deletingId = null;
        this.propertyToDelete = null;
      },
      error: (error) => {
        this.notificationService.error(error.error?.message || 'Failed to delete property');
        this.deletingId = null;
        this.propertyToDelete = null;
      }
    });
  }

  logout(): void {
    this.authService.logout();
    window.location.href = '/admin';
  }
}
