import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { walletOutline, checkmarkCircleOutline, informationCircleOutline } from 'ionicons/icons';

interface AvailableCredit {
  bankName: string;
  logoColor: string;
  availableAmount: number;
  creditType: string;
  description: string;
  interestRate: string;
}

@Component({
  selector: 'app-tab3',
  templateUrl: './tab3.page.html',
  styleUrls: ['./tab3.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab3Page {
  credits: AvailableCredit[] = [
    {
      bankName: 'Banco Popular',
      logoColor: '#003366',
      availableAmount: 250000.00,
      creditType: 'Extracrédito Pre-aprobado',
      description: 'Línea de crédito adicional disponible de inmediato sin afectar la cuota de tu tarjeta principal.',
      interestRate: '14.5% anual'
    },
    {
      bankName: 'Banco BHD',
      logoColor: '#00875a',
      availableAmount: 120000.00,
      creditType: 'Aumento de Límite',
      description: 'Incremento pre-aprobado para tu tarjeta Mastercard Black disponible a solicitud.',
      interestRate: '18.0% anual'
    },
    {
      bankName: 'Scotiabank',
      logoColor: '#cc0000',
      availableAmount: 300000.00,
      creditType: 'Préstamo Pre-Aprobado',
      description: 'Oferta especial de crédito personal con desembolso inmediato a tu cuenta.',
      interestRate: '13.9% anual'
    }
  ];

  constructor() {
    addIcons({ walletOutline, checkmarkCircleOutline, informationCircleOutline });
  }
}