import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  shieldCheckmark, 
  walletOutline, 
  keyOutline, 
  chatbubbleEllipsesOutline, 
  arrowBackOutline,
  wifiOutline,
  closeOutline,
  cardOutline,
  bookOutline,       // Centro de Información
  calculatorOutline, // Simulador de Crédito
  pulseOutline       // Salud Financiera
} from 'ionicons/icons';

// Las importaciones aquí arriba SE MANTIENEN para el ModalController
import { CentroInformacionPage } from '../centro-informacion/centro-informacion.page';
import { SaludFinancieraPage } from '../salud-financiera/salud-financiera.page';
import { SimuladorCreditoPage } from '../simulador-credito/simulador-credito.page';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
  standalone: true,
  imports: [
    CommonModule // Se remueven las 3 páginas de este arreglo
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class WelcomePage {
  private router = inject(Router);
  private modalCtrl = inject(ModalController);

  modalTarjetasAbierto: boolean = false;
  modalSolicitudAbierto: boolean = false;
  tarjetaSeleccionada: string = '';

  constructor() {
    addIcons({
      shieldCheckmark,
      walletOutline,
      keyOutline,
      chatbubbleEllipsesOutline,
      arrowBackOutline,
      wifiOutline,
      closeOutline,
      cardOutline,
      bookOutline,
      calculatorOutline,
      pulseOutline
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }

  abrirTarjetasDisponibles() {
    this.modalTarjetasAbierto = true;
  }

  cerrarModalTarjetas() {
    this.modalTarjetasAbierto = false;
  }

  abrirSolicitud(nombreTarjeta: string) {
    this.tarjetaSeleccionada = nombreTarjeta;
    this.modalSolicitudAbierto = true;
  }

  cerrarModalSolicitud() {
    this.modalSolicitudAbierto = false;
  }

  enviarSolicitud(event: Event) {
    event.preventDefault();
    alert(`¡Solicitud enviada con éxito para la tarjeta: ${this.tarjetaSeleccionada}!`);
    this.cerrarModalSolicitud();
  }

  // --- MÉTODOS PARA ABRIR CADA MODAL ---

  async openInfoCenter() {
    const modal = await this.modalCtrl.create({
      component: CentroInformacionPage
    });
    await modal.present();
  }

  async openCreditSimulator() {
    const modal = await this.modalCtrl.create({
      component: SimuladorCreditoPage
    });
    await modal.present();
  }

  async openFinancialHealth() {
    const modal = await this.modalCtrl.create({
      component: SaludFinancieraPage
    });
    await modal.present();
  }
}