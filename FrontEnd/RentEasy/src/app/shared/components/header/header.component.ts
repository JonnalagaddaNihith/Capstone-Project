import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatDividerModule } from '@angular/material/divider';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import { User } from '../../models/user.model';
import { 
  AppState, 
  AuthActions, 
  selectUser, 
  selectIsAuthenticated, 
  selectIsOwner, 
  selectIsTenant 
} from '../../../store';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatDividerModule
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  private store = inject(Store<AppState>);

  user$: Observable<User | null> = this.store.select(selectUser);
  isAuthenticated$: Observable<boolean> = this.store.select(selectIsAuthenticated);
  isOwner$: Observable<boolean> = this.store.select(selectIsOwner);
  isTenant$: Observable<boolean> = this.store.select(selectIsTenant);

  ngOnInit(): void {
    // Load user from storage on app start
    this.store.dispatch(AuthActions.loadUserFromStorage());
  }

  logout(): void {
    this.store.dispatch(AuthActions.logout());
  }
}
