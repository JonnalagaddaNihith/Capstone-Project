import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';

@Component({
  selector: 'app-register',
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
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  hidePassword = true;
  selectedRole: 'Owner' | 'Tenant' = 'Tenant';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['Tenant', Validators.required]
    });
  }

  selectRole(role: 'Owner' | 'Tenant'): void {
    this.selectedRole = role;
    this.registerForm.patchValue({ role });
  }

  onSubmit(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const userData = this.registerForm.value;

    this.authService.register(userData).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success) {
          this.notificationService.success('Account created successfully! Please login.');
          this.router.navigate(['/login']);
        } else {
          this.notificationService.error(response.message || 'Registration failed');
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.notificationService.error(error.error?.message || 'Registration failed. Please try again.');
      }
    });
  }
}
