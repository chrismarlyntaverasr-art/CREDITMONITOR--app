import { Component, Input, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController, ToastController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, documentTextOutline, downloadOutline, calendarOutline, alertCircleOutline } from 'ionicons/icons';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-statement-modal',
  templateUrl: './statement-modal.component.html',
  styleUrls: ['./statement-modal.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class StatementModalComponent {
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  @Input() card: any;

  constructor() {
    addIcons({ 
      closeOutline, 
      documentTextOutline, 
      downloadOutline, 
      calendarOutline, 
      alertCircleOutline 
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }

  async downloadPDF() {
    if (!this.card) return;

    const toastLoading = await this.toastCtrl.create({
      message: 'Generando archivo PDF...',
      duration: 1500,
      position: 'bottom',
      color: 'primary'
    });
    await toastLoading.present();

    try {
      const doc = new jsPDF();

      // Encabezado
      doc.setFillColor(17, 29, 53); // Color de fondo #111d35
      doc.rect(0, 0, 210, 35, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(20);
      doc.setFont('helvetica', 'bold');
      doc.text('CREDITMONITOR', 15, 22);

      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      doc.text('Estado de Cuenta Mensual', 130, 22);

      // Datos de la Tarjeta
      doc.setTextColor(30, 41, 59);
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text(`Tarjeta: ${this.card.cardName || 'CreditMonitor Card'}`, 15, 50);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Número de Tarjeta: ${this.card.cardNumber || '•••• 0000'}`, 15, 58);
      doc.text(`Tipo: ${this.card.type || 'N/A'}`, 15, 65);
      doc.text(`Período: Septiembre 2026`, 130, 58);

      // Línea divisoria
      doc.setDrawColor(200, 200, 200);
      doc.line(15, 72, 195, 72);

      // Resumen Financiero
      doc.setFontSize(13);
      doc.setFont('helvetica', 'bold');
      doc.text('Resumen de Saldos', 15, 83);

      doc.setFontSize(11);
      doc.setFont('helvetica', 'normal');
      doc.text(`Saldo al Corte:`, 15, 93);
      doc.text(`$${(this.card.balance || 0).toFixed(2)}`, 130, 93);

      doc.text(`Pago Mínimo Sugerido:`, 15, 101);
      doc.text(`$${((this.card.balance || 0) * 0.05).toFixed(2)}`, 130, 101);

      doc.text(`Fecha de Corte:`, 15, 109);
      doc.text(`${this.card.cutOffDate || 'N/A'}`, 130, 109);

      doc.text(`Fecha Límite de Pago:`, 15, 117);
      doc.text(`${this.card.dueDate || 'N/A'}`, 130, 117);

      // Línea divisoria
      doc.line(15, 125, 195, 125);

      // Pie de página
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 120);
      doc.text('Este documento es un comprobante digital generado automáticamente por CreditMonitor.', 15, 140);

      // Descarga del archivo PDF
      const fileName = `Estado_de_Cuenta_${this.card.cardName ? this.card.cardName.replace(/\s+/g, '_') : 'Tarjeta'}.pdf`;
      doc.save(fileName);

      const toastSuccess = await this.toastCtrl.create({
        message: '¡PDF descargado con éxito!',
        duration: 2500,
        position: 'bottom',
        color: 'success'
      });
      await toastSuccess.present();

    } catch (error) {
      console.error('Error al generar el PDF:', error);
      const toastError = await this.toastCtrl.create({
        message: 'Error al generar el PDF.',
        duration: 2500,
        position: 'bottom',
        color: 'danger'
      });
      await toastError.present();
    }
  }
}