import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { Router } from '@angular/router';
import { 
  closeOutline,
  walletOutline, 
  trendingUpOutline, 
  pieChartOutline, 
  alertCircleOutline, 
  checkmarkCircleOutline,
  chevronForwardOutline, 
  headsetOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-salud-financiera',
  templateUrl: './salud-financiera.page.html',
  styleUrls: ['./salud-financiera.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SaludFinancieraPage {
  private modalCtrl = inject(ModalController);
    private router = inject(Router);

  // Puntuación general de salud financiera
  financialScore: number = 78;
  
  // Categorías de diagnóstico
  metrics = [
    { title: 'Nivel de Endeudamiento', status: 'Excelente', score: '18%', icon: 'pie-chart-outline', color: 'success' },
    { title: 'Capacidad de Ahorro', status: 'Bueno', score: '25%', icon: 'wallet-outline', color: 'primary' },
    { title: 'Uso de Crédito', status: 'Moderado', score: '42%', icon: 'trending-up-outline', color: 'warning' }
  ];

  // Consejos personalizados
  tips = [
    'Mantén la utilización de tu tarjeta por debajo del 30%.',
    'Destina al menos el 10% de tus ingresos a un fondo de emergencia.',
    'Evita realizar múltiples solicitudes de crédito en un periodo corto.'
  ];

  constructor() {
    addIcons({ 
      closeOutline,
      walletOutline, 
      trendingUpOutline, 
      pieChartOutline, 
      alertCircleOutline, 
      checkmarkCircleOutline,
      chevronForwardOutline,
      headsetOutline
    });
  }

  cerrar() {
    this.modalCtrl.dismiss();
  }
     async irAPodcasts() {
    await this.modalCtrl.dismiss() ;
    this.router.navigateByUrl('/podcasts') ;
  }
}