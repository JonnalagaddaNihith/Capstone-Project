import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { ownerGuard } from './core/guards/owner.guard';
import { tenantGuard } from './core/guards/tenant.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  // Public Routes
  {
    path: '',
    loadComponent: () => import('./features/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register.component').then(m => m.RegisterComponent)
  },
  {
    path: 'properties',
    loadComponent: () => import('./features/properties/property-list/property-list.component').then(m => m.PropertyListComponent)
  },
  {
    path: 'properties/:id',
    loadComponent: () => import('./features/properties/property-details/property-details.component').then(m => m.PropertyDetailsComponent)
  },

  // Owner Routes
  {
    path: 'owner/dashboard',
    loadComponent: () => import('./features/owner/dashboard/owner-dashboard.component').then(m => m.OwnerDashboardComponent),
    canActivate: [ownerGuard]
  },
  {
    path: 'owner/properties',
    loadComponent: () => import('./features/owner/my-properties/my-properties.component').then(m => m.MyPropertiesComponent),
    canActivate: [ownerGuard]
  },
  {
    path: 'owner/properties/new',
    loadComponent: () => import('./features/properties/property-form/property-form.component').then(m => m.PropertyFormComponent),
    canActivate: [ownerGuard]
  },
  {
    path: 'owner/properties/:id/edit',
    loadComponent: () => import('./features/properties/property-form/property-form.component').then(m => m.PropertyFormComponent),
    canActivate: [ownerGuard]
  },
  {
    path: 'owner/bookings',
    loadComponent: () => import('./features/owner/booking-requests/booking-requests.component').then(m => m.BookingRequestsComponent),
    canActivate: [ownerGuard]
  },

  // Tenant Routes
  {
    path: 'tenant/dashboard',
    loadComponent: () => import('./features/tenant/dashboard/tenant-dashboard.component').then(m => m.TenantDashboardComponent),
    canActivate: [tenantGuard]
  },
  {
    path: 'tenant/bookings',
    loadComponent: () => import('./features/tenant/my-bookings/my-bookings.component').then(m => m.MyBookingsComponent),
    canActivate: [tenantGuard]
  },

  // Admin Routes (Hidden - users must navigate to /admin manually)
  {
    path: 'admin',
    loadComponent: () => import('./features/admin/login/admin-login.component').then(m => m.AdminLoginComponent)
  },
  {
    path: 'admin/dashboard',
    loadComponent: () => import('./features/admin/dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/users',
    loadComponent: () => import('./features/admin/users/admin-users.component').then(m => m.AdminUsersComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'admin/properties',
    loadComponent: () => import('./features/admin/properties/admin-properties.component').then(m => m.AdminPropertiesComponent),
    canActivate: [adminGuard]
  },

  // Fallback
  {
    path: '**',
    loadComponent: () => import('./shared/components/not-found/not-found.component').then(m => m.NotFoundComponent)
  }
];

