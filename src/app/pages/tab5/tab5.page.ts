import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  ToastController,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import { addIcons } from 'ionicons';
import {
  personOutline,
  lockClosedOutline,
  person,
  cameraOutline
} from 'ionicons/icons';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';

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

  // Foto de perfil
  fotoPerfil: string | undefined;

  private readonly FOTO_PERFIL_KEY = 'creditmonitor_foto_perfil';

  user = {
    fullName: 'Chrismarlyn Taveras',
    email: 'chrismarlyn@creditmonitor.com',
    phone: '809-555-0199',
    associatedBank: 'Banco Popular',
    currentPassword: '',
    newPassword: ''
  };

  banks: string[] = [
    'Banco Popular',
    'Banco BHD',
    'Banreservas',
    'Scotiabank'
  ];

  constructor() {
    addIcons({
      personOutline,
      lockClosedOutline,
      person,
      cameraOutline
    });

    this.cargarFotoPerfil();
  }

  /**
   * Abre la cámara o selector de imágenes
   * y establece la imagen seleccionada como foto de perfil.
   */
  async tomarFotoPerfil() {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera
      });

      this.fotoPerfil = image.dataUrl;

      if (this.fotoPerfil) {
        localStorage.setItem(
          this.FOTO_PERFIL_KEY,
          this.fotoPerfil
        );
      }

    } catch (error) {
      console.error(
        'No se pudo tomar la foto de perfil:',
        error
      );
    }
  }

  /**
   * Carga la foto de perfil guardada anteriormente.
   */
  private cargarFotoPerfil() {
    const fotoGuardada = localStorage.getItem(
      this.FOTO_PERFIL_KEY
    );

    if (fotoGuardada) {
      this.fotoPerfil = fotoGuardada;
    }
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