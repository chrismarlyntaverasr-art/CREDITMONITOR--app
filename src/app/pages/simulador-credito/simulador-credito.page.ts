import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  closeOutline,
  calculatorOutline, 
  cashOutline, 
  calendarOutline, 
  analyticsOutline,
  checkmarkCircleOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-simulador-credito',
  templateUrl: './simulador-credito.page.html',
  styleUrls: ['./simulador-credito.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SimuladorCreditoPage {
  private modalCtrl = inject(ModalController);

  // Variables del simulador
  amount: number = 50000;       // Monto prestado por defecto
  termMonths: number = 12;      // Plazo en meses por defecto
  annualInterestRate: number = 18; // Tasa de interés anual (%)

  constructor() {
    addIcons({ 
      closeOutline,
      calculatorOutline, 
      cashOutline, 
      calendarOutline, 
      analyticsOutline,
      checkmarkCircleOutline
    });
  }

  // Cálculo de cuota mensual fija (Fórmula de amortización)
  get monthlyPayment(): number {
    const monthlyRate = (this.annualInterestRate / 100) / 12;
    if (monthlyRate === 0) return this.amount / this.termMonths;
    return (this.amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -this.termMonths));
  }

  // Total de intereses a pagar durante todo el plazo
  get totalInterest(): number {
    return (this.monthlyPayment * this.termMonths) - this.amount;
  }

  // Monto total a pagar (Principal + Intereses)
  get totalAmountToPay(): number {
    return this.monthlyPayment * this.termMonths;
  }

  // Método para cerrar el modal y regresar a la pantalla Welcome
  cerrar() {
    this.modalCtrl.dismiss();
  }
}