import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PropertyService } from '../../../core/services/property.service';
import { NotificationService } from '../../../core/services/notification.service';
import { Property } from '../../../shared/models/property.model';

@Component({
  selector: 'app-property-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './property-form.component.html'
})
export class PropertyFormComponent implements OnInit {
  propertyForm: FormGroup;
  isLoading = false;
  isEditMode = false;
  propertyId: number | null = null;
  photos: (string | null)[] = [null, null, null, null];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private propertyService: PropertyService,
    private notificationService: NotificationService
  ) {
    this.propertyForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      property_description: ['', [Validators.required, Validators.minLength(20)]],
      rent_per_day: ['', [Validators.required, Validators.min(1)]],
      location: ['', [Validators.required]],
      amenities: ['']
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.propertyId = parseInt(id, 10);
      this.loadProperty();
    }
  }

  loadProperty(): void {
    if (!this.propertyId) return;
    
    this.isLoading = true;
    this.propertyService.getPropertyById(this.propertyId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const p = response.data;
          this.propertyForm.patchValue({
            title: p.title,
            property_description: p.property_description,
            rent_per_day: p.rent_per_day,
            location: p.location,
            amenities: p.amenities
          });
          this.photos = [p.photo1 || null, p.photo2 || null, p.photo3 || null, p.photo4 || null];
        }
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
        this.notificationService.error('Failed to load property');
      }
    });
  }

  onFileSelect(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.photos[index] = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removePhoto(index: number): void {
    this.photos[index] = null;
  }

  onSubmit(): void {
    if (this.propertyForm.invalid) {
      this.propertyForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const formData = {
      ...this.propertyForm.value,
      photo1: this.photos[0],
      photo2: this.photos[1],
      photo3: this.photos[2],
      photo4: this.photos[3]
    };

    const request = this.isEditMode
      ? this.propertyService.updateProperty(this.propertyId!, formData)
      : this.propertyService.createProperty(formData);

    request.subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notificationService.success(
            this.isEditMode ? 'Property updated successfully!' : 'Property created successfully!'
          );
          this.router.navigate(['/owner/properties']);
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.error(error.error?.message || 'Failed to save property');
      }
    });
  }
}
