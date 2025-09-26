import { Injectable } from '@angular/core';

export interface NotificationConfig {
  title: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
  duration?: number; // em milissegundos, 0 = não remove automaticamente
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

export interface Notification extends NotificationConfig {
  id: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notifications: Notification[] = [];
  private readonly defaultDuration = 5000; // 5 segundos

  constructor() {}

  /**
   * Adiciona uma notificação
   */
  add(config: NotificationConfig): string {
    const notification: Notification = {
      ...config,
      id: this.generateId(),
      timestamp: new Date(),
      duration: config.duration ?? this.defaultDuration
    };

    this.notifications.unshift(notification);

    // Remove automaticamente após o tempo especificado
    if (notification.duration && notification.duration > 0) {
      setTimeout(() => {
        this.remove(notification.id);
      }, notification.duration);
    }

    return notification.id;
  }

  /**
   * Remove uma notificação específica
   */
  remove(id: string): void {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  /**
   * Remove todas as notificações
   */
  clear(): void {
    this.notifications = [];
  }

  /**
   * Obtém todas as notificações
   */
  getAll(): Notification[] {
    return [...this.notifications];
  }

  /**
   * Shortcuts para tipos específicos
   */
  success(title: string, message: string, duration?: number): string {
    return this.add({ title, message, type: 'success', duration });
  }

  error(title: string, message: string, duration?: number): string {
    return this.add({ title, message, type: 'error', duration: duration ?? 0 });
  }

  warning(title: string, message: string, duration?: number): string {
    return this.add({ title, message, type: 'warning', duration });
  }

  info(title: string, message: string, duration?: number): string {
    return this.add({ title, message, type: 'info', duration });
  }

  private generateId(): string {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
  }
}
