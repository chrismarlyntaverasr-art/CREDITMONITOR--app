import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { cardOutline, businessOutline, cashOutline, alertCircleOutline } from 'ionicons/icons';

interface BankDebt {
  bankName: string;
  logoColor: string;
  totalDebt: number;
  loans: { title: string; amount: number; monthlyPayment: number }[];
  cards: { name: string; number: string; debt: number }[];
}

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page {
  bankDebts: BankDebt[] = [
    {
      bankName: 'Banco Popular',
      logoColor: '#003366',
      totalDebt: 125000.00,
      loans: [
        { title: 'Préstamo Personal', amount: 85000.00, monthlyPayment: 3200.00 }
      ],
      cards: [
        { name: 'Visa Gold Popular', number: '•••• 4821', debt: 40000.00 }
      ]
    },
    {
      bankName: 'Banco BHD',
      logoColor: '#00875a',
      totalDebt: 68500.00,
      loans: [
        { title: 'Préstamo Vehículo', amount: 45000.00, monthlyPayment: 2100.00 }
      ],
      cards: [
        { name: 'Mastercard Black BHD', number: '•••• 8902', debt: 23500.00 }
      ]
    },
    {
      bankName: 'Banreservas',
      logoColor: '#2f9cd3',
      totalDebt: 15400.00,
      loans: [],
      cards: [
        { name: 'Visa Clásica Banreservas', number: '•••• 1154', debt: 15400.00 }
      ]
    }
  ];

  constructor() {
    addIcons({ cardOutline, businessOutline, cashOutline, alertCircleOutline });
  }

  getTotalDebtOverall(): number {
    return this.bankDebts.reduce((sum, b) => sum + b.totalDebt, 0);
  }
}