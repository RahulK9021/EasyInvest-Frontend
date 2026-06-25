import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AppNotification } from '../services/api.models';
import { EngagementService } from '../services/engagement.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notifications.component.html',
  styleUrl: './notifications.component.css'
})
export class NotificationsComponent implements OnInit {
  notifications: AppNotification[] = [];
  loading = true;

  constructor(private engagementService: EngagementService) {}

  ngOnInit() {
    this.loadNotifications();
  }

  loadNotifications() {
    this.engagementService.getNotifications().subscribe({
      next: (res) => {
        this.notifications = Array.isArray(res) ? res : [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  markRead(notification: AppNotification) {
    this.engagementService.markNotificationRead(notification.id).subscribe({
      next: (res) => {
        notification.isRead = res.isRead;
      }
    });
  }

  deleteNotification(id: number) {
    this.engagementService.deleteNotification(id).subscribe({
      next: () => {
        this.notifications = this.notifications.filter((notification) => notification.id !== id);
      }
    });
  }
}
