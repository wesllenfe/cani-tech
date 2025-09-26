import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { NotificationService, Notification } from '../../services/notification.service';

@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="notifications-container">
      <div
        *ngFor="let notification of notifications; trackBy: trackByFn"
        class="notification"
        [class]="'notification-' + notification.type"
        [@slideIn]
      >
        <div class="notification-content">
          <div class="notification-icon">
            <i
              class="fas"
              [class.fa-check-circle]="notification.type === 'success'"
              [class.fa-exclamation-triangle]="notification.type === 'warning'"
              [class.fa-times-circle]="notification.type === 'error'"
              [class.fa-info-circle]="notification.type === 'info'"
            ></i>
          </div>
          <div class="notification-text">
            <h4 class="notification-title">{{ notification.title }}</h4>
            <p class="notification-message">{{ notification.message }}</p>
          </div>
          <div class="notification-actions">
            <button
              *ngFor="let action of notification.actions"
              class="btn-action"
              (click)="action.action()"
            >
              {{ action.label }}
            </button>
          </div>
          <button
            class="notification-close"
            (click)="remove(notification.id)"
            aria-label="Fechar notificação"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .notifications-container {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 12px;
      max-width: 400px;
      pointer-events: none;
    }

    .notification {
      background: var(--c-surface);
      border-radius: var(--radius-lg);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
      overflow: hidden;
      pointer-events: auto;
      transform: translateX(100%);
      animation: slideIn 0.3s ease-out forwards;
      border-left: 4px solid;
    }

    .notification-success {
      border-left-color: #10b981;
    }

    .notification-error {
      border-left-color: #ef4444;
    }

    .notification-warning {
      border-left-color: #f59e0b;
    }

    .notification-info {
      border-left-color: #3b82f6;
    }

    .notification-content {
      display: flex;
      align-items: flex-start;
      padding: 16px;
      gap: 12px;
      position: relative;
    }

    .notification-icon {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      margin-top: 2px;
    }

    .notification-success .notification-icon {
      background: rgba(16, 185, 129, 0.1);
      color: #10b981;
    }

    .notification-error .notification-icon {
      background: rgba(239, 68, 68, 0.1);
      color: #ef4444;
    }

    .notification-warning .notification-icon {
      background: rgba(245, 158, 11, 0.1);
      color: #f59e0b;
    }

    .notification-info .notification-icon {
      background: rgba(59, 130, 246, 0.1);
      color: #3b82f6;
    }

    .notification-text {
      flex: 1;
    }

    .notification-title {
      font-size: 0.875rem;
      font-weight: 600;
      margin: 0 0 4px 0;
      color: var(--c-text);
    }

    .notification-message {
      font-size: 0.8rem;
      margin: 0;
      color: var(--c-muted);
      line-height: 1.4;
    }

    .notification-actions {
      display: flex;
      gap: 8px;
      margin-top: 8px;
    }

    .btn-action {
      background: transparent;
      border: 1px solid rgba(0, 0, 0, 0.1);
      border-radius: var(--radius-sm);
      padding: 4px 8px;
      font-size: 0.75rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;
    }

    .btn-action:hover {
      background: rgba(0, 0, 0, 0.05);
    }

    .notification-close {
      position: absolute;
      top: 8px;
      right: 8px;
      background: transparent;
      border: none;
      color: var(--c-muted);
      cursor: pointer;
      padding: 4px;
      border-radius: var(--radius-sm);
      transition: all 0.2s ease;
    }

    .notification-close:hover {
      background: rgba(0, 0, 0, 0.05);
      color: var(--c-text);
    }

    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }

    @media (max-width: 640px) {
      .notifications-container {
        left: 20px;
        right: 20px;
        max-width: none;
      }
    }
  `]
})
export class NotificationsComponent implements OnInit, OnDestroy {
  notifications: Notification[] = [];
  private intervalId?: number;

  constructor(private notificationService: NotificationService) {}

  ngOnInit() {
    // Atualiza a lista de notificações periodicamente
    this.updateNotifications();
    this.intervalId = window.setInterval(() => {
      this.updateNotifications();
    }, 100);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  private updateNotifications() {
    this.notifications = this.notificationService.getAll();
  }

  remove(id: string) {
    this.notificationService.remove(id);
  }

  trackByFn(index: number, notification: Notification) {
    return notification.id;
  }
}
