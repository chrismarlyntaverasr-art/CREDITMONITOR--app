import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, IonSelect, IonSelectOption } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { personOutline, lockClosedOutline, person } from 'ionicons/icons';

@Component({
  selector: 'app-tab5',
  templateUrl: './tab5.page.html',
  styleUrls: ['./tab5.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonSelect,
    IonSelectOption
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab5Page {
  private toastCtrl = inject(ToastController);

  user = {
    fullName: 'Chrismarlyn Taveras',
    email: 'chrismarlyn@creditmonitor.com',
    phone: '809-555-0199',
    associatedBank: 'Banco Popular',
    currentPassword: '',
    newPassword: ''
  };

  banks: string[] = ['Banco Popular', 'Banco BHD', 'Banreservas', 'Scotiabank'];

  constructor() {
    addIcons({ personOutline, lockClosedOutline, person });
  }

  async saveProfile() {
    const toast = await this.toastCtrl.create({
      message: 'Perfil actualizado correctamente.',
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }

  async updatePassword() {
    if (!this.user.currentPassword || !this.user.newPassword) {
      const toast = await this.toastCtrl.create({
        message: 'Por favor completa los campos de contraseña.',
        duration: 2500,
        color: 'warning',
        position: 'bottom'
      });
      await toast.present();
      return;
    }

    const toast = await this.toastCtrl.create({
      message: 'Contraseña cambiada con éxito.',
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
    this.user.currentPassword = '';
    this.user.newPassword = '';
  }
}