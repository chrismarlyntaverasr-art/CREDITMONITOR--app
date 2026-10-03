import { Component, Input, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, walletOutline, wifiOutline, checkmarkCircleOutline, cardOutline } from 'ionicons/icons';

export interface CreditCard {
  id: number;
  cardName: string;
  cardNumber: string;
  balance: number;
  limit: number;
  type: string;
  colorClass?: string;
}

@Component({
  selector: 'app-pay-modal',
  templateUrl: './pay-modal.component.html',
  styleUrls: ['./pay-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PayModalComponent {
  private modalCtrl = inject(ModalController);

  @Input() card?: CreditCard;
  paymentAmount: number = 0;

  constructor() {
    addIcons({
      closeOutline,
      walletOutline,
      wifiOutline,
      checkmarkCircleOutline,
      cardOutline
    });
  }

  /**
   * Asigna un valor precalculado al campo de monto (p. ej. desde los chips rápidos)
   */
  setAmount(value?: number) {
    if (value !== undefined && value !== null) {
      this.paymentAmount = Number(value.toFixed(2));
    }
  }

  /**
   * Calcula el porcentaje seleccionado sobre el saldo total de la tarjeta
   */
  setPercentage(percentage: number) {
    if (this.card && this.card.balance) {
      const calculated = (this.card.balance * percentage) / 100;
      this.setAmount(calculated);
    }
  }

  /**
   * Obtiene el nuevo saldo pendiente calculado en tiempo real
   */
  getNewBalance(): number {
    if (!this.card || typeof this.card.balance !== 'number') return 0;
    const remaining = this.card.balance - (this.paymentAmount || 0);
    return Math.max(0, remaining);
  }

  /**
   * Cierra el modal sin realizar ninguna acción
   */
  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  /**
   * Confirma el pago y envía los datos de vuelta a tab1
   */
  confirmPayment() {
    if (!this.paymentAmount || this.paymentAmount <= 0) return;

    this.modalCtrl.dismiss(
      {
        amount: this.paymentAmount,
        cardId: this.card?.id
      },
      'confirm'
    );
  }
}