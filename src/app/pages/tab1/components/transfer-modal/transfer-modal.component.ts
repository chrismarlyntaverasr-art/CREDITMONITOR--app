import { Component, Input, inject, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, swapHorizontalOutline, walletOutline, arrowForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-transfer-modal',
  templateUrl: './transfer-modal.component.html',
  styleUrls: ['./transfer-modal.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class TransferModalComponent implements OnInit {
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  @Input() sourceCard: any;
  @Input() allCards: any[] = [];

  targetCardId: number | null = null;
  transferAmount: number | null = null;
  transferNote: string = '';

  constructor() {
    addIcons({
      closeOutline,
      swapHorizontalOutline,
      walletOutline,
      arrowForwardOutline
    });
  }

  ngOnInit() {
    // Si existen tarjetas de destino válidas, selecciona la primera automáticamente por defecto
    if (this.availableCards && this.availableCards.length > 0) {
      this.targetCardId = this.availableCards[0].id;
    }
  }

  get availableCards() {
    return this.allCards.filter(c => c.id !== this.sourceCard?.id);
  }

  closeModal() {
    this.modalCtrl.dismiss(null, 'cancel');
  }

  async processTransfer() {
    if (!this.transferAmount || this.transferAmount <= 0) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, ingresa un monto válido.',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    if (!this.targetCardId) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor, selecciona una tarjeta de destino.',
        duration: 2000,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    this.modalCtrl.dismiss({
      amount: this.transferAmount,
      targetCardId: this.targetCardId,
      note: this.transferNote
    }, 'confirm');
  }
}