import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { AppNotification } from '../../services/api.models';
import { EngagementService } from '../../services/engagement.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {
  notifications: AppNotification[] = [];

  constructor(
    private router: Router,
    private engagementService: EngagementService
  ) {}

  ngOnInit() {
    this.loadNotifications();
  }

  get token(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem('token');
  }

  get isLoggedIn(): boolean {
    return !!this.token;
  }

  get role(): string {
    if (!this.token) {
      return '';
    }

    try {
      const decoded: any = jwtDecode(this.token);
      return decoded.role ?? '';
    } catch {
      return '';
    }
  }

  get dashboardRoute(): string {
    switch (this.role) {
      case 'INVESTOR':
        return '/investor/dashboard';
      case 'FOUNDER':
        return '/founder/dashboard';
      case 'ADMIN':
        return '/admin/dashboard';
      default:
        return '/login';
    }
  }

  get unreadCount(): number {
    return this.notifications.filter((notification) => !notification.isRead).length;
  }

  get latestNotifications(): AppNotification[] {
    return this.notifications.slice(0, 5);
  }

  loadNotifications(): void {
    if (!this.isLoggedIn) {
      this.notifications = [];
      return;
    }

    this.engagementService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = Array.isArray(res) ? res : [];
      }
    });
  }

  markRead(notification: AppNotification): void {
    this.engagementService.markNotificationRead(notification.id).subscribe({
      next: (res) => {
        notification.isRead = res.isRead;
      }
    });
  }

  logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }

    this.router.navigate(['/login']);
  }

}
