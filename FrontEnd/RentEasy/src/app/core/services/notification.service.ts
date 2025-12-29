import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  public notifications$ = this.notificationsSubject.asObservable();
  private counter = 0;

  show(message: string, type: 'success' | 'error' | 'warning' | 'info' = 'info', duration = 5000): void {
    const notification: Notification = {
      id: ++this.counter,
      message,
      type,
      duration
    };
    
    this.notifications.push(notification);
    this.notificationsSubject.next([...this.notifications]);

    if (duration > 0) {
      setTimeout(() => this.dismiss(notification.id), duration);
    }
  }

  success(message: string, duration = 5000): void {
    this.show(message, 'success', duration);
  }

  error(message: string, duration = 7000): void {
    this.show(message, 'error', duration);
  }

  warning(message: string, duration = 5000): void {
    this.show(message, 'warning', duration);
  }

  info(message: string, duration = 5000): void {
    this.show(message, 'info', duration);
  }

  dismiss(id: number): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
    this.notificationsSubject.next([...this.notifications]);
  }

  dismissAll(): void {
    this.notifications = [];
    this.notificationsSubject.next([]);
  }
}
