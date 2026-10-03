import { Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { addIcons } from 'ionicons';
import { heartOutline, statsChartOutline, shirtOutline, wineOutline, flashOutline } from 'ionicons/icons';

interface SpendingCategory {
  category: string;
  percentage: number;
  amount: number;
  icon: string;
  color: string;
}

@Component({
  selector: 'app-tab4',
  templateUrl: './tab4.page.html',
  styleUrls: ['./tab4.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab4Page {
  healthScore: number = 78; // Puntaje sobre 100
  debtRatioPercentage: number = 32; // Nivel de endeudamiento %
  paymentHistoryScore: string = 'Excelente (98% a tiempo)';

  spendingCategories: SpendingCategory[] = [
    { category: 'Salidas Sociales / Rest.', percentage: 35, amount: 18500, icon: 'wine-outline', color: 'warning' },
    { category: 'Ropa y Moda', percentage: 25, amount: 13200, icon: 'shirt-outline', color: 'tertiary' },
    { category: 'Festividades y Eventos', percentage: 20, amount: 10500, icon: 'flash-outline', color: 'danger' },
    { category: 'Otros Gastos', percentage: 20, amount: 10500, icon: 'stats-chart-outline', color: 'medium' }
  ];

  constructor() {
    addIcons({ heartOutline, statsChartOutline, shirtOutline, wineOutline, flashOutline });
  }
}
