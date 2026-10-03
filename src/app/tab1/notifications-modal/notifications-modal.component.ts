import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  date: string;
  time: string;
  type: 'payment' | 'alert' | 'system';
  isRead: boolean;
}

@Component({
  selector: 'app-notifications-modal',
  templateUrl: './notifications-modal.component.html',
  styleUrls: ['./notifications-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NotificationsModalComponent {
  private modalCtrl = inject(ModalController);

  cards: any[] = [];
  activeSegment: 'notifications' | 'calendar' = 'notifications';
  selectedFilter: 'all' | 'unread' | 'payments' = 'all';

  notifications: AppNotification[] = [
    {
      id: 1,
      title: 'Próximo Corte de Tarjeta',
      message: 'Tu tarjeta SuperCard Rewards corta en 4 días (02 Oct 2026).',
      date: '28 Sep 2026',
      time: '09:00 AM',
      type: 'payment',
      isRead: false
    },
    {
      id: 2,
      title: 'Límite de Pago Cercano',
      message: 'Fecha límite de pago para Black Platinum el 25 de Octubre.',
      date: '25 Sep 2026',
      time: '02:30 PM',
      type: 'alert',
      isRead: false
    },
    {
      id: 3,
      title: 'Cashback Recibido',
      message: 'Se han acreditado $45.00 de cashback a tu cuenta.',
      date: '18 Sep 2026',
      time: '11:15 AM',
      type: 'system',
      isRead: true
    }
  ];

  get unreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  get filteredNotifications(): AppNotification[] {
    if (this.selectedFilter === 'unread') {
      return this.notifications.filter(n => !n.isRead);
    }
    if (this.selectedFilter === 'payments') {
      return this.notifications.filter(n => n.type === 'payment' || n.type === 'alert');
    }
    return this.notifications;
  }

  markAsRead(notification: AppNotification) {
    notification.isRead = true;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
  }

  deleteNotification(id: number) {
    this.notifications = this.notifications.filter(n => n.id !== id);
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}