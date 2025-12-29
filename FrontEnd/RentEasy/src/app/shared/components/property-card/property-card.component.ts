import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Property } from '../../models/property.model';

@Component({
  selector: 'app-property-card',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './property-card.component.html',
  styleUrl: './property-card.component.css'
})
export class PropertyCardComponent {
  @Input() property!: Property;
  @Input() showActions = false;
  @Output() edit = new EventEmitter<Property>();
  @Output() delete = new EventEmitter<Property>();

  currentImageIndex = 0;

  get photos(): string[] {
    const photos: string[] = [];
    if (this.property?.photo1) photos.push(this.property.photo1);
    if (this.property?.photo2) photos.push(this.property.photo2);
    if (this.property?.photo3) photos.push(this.property.photo3);
    if (this.property?.photo4) photos.push(this.property.photo4);
    return photos;
  }

  get amenitiesList(): string[] {
    if (!this.property?.amenities) return [];
    return this.property.amenities.split(',').map(a => a.trim()).filter(a => a);
  }

  get currentImage(): string | null {
    return this.photos[this.currentImageIndex] || null;
  }

  nextImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.photos.length > 1) {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.photos.length;
    }
  }

  prevImage(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    if (this.photos.length > 1) {
      this.currentImageIndex = this.currentImageIndex === 0 
        ? this.photos.length - 1 
        : this.currentImageIndex - 1;
    }
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.edit.emit(this.property);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.delete.emit(this.property);
  }
}
