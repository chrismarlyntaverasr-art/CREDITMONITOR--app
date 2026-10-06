import {
  Component,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  ViewChild,
  ElementRef
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ToastController,
  IonSelect,
  IonSelectOption
} from '@ionic/angular';

import { Router } from '@angular/router';

import { addIcons } from 'ionicons';

import {
  personOutline,
  lockClosedOutline,
  person,
  cameraOutline,
  logOutOutline
} from 'ionicons/icons';

import {
  Camera,
  CameraResultType,
  CameraSource
} from '@capacitor/camera';


/* =========================================================
   INFORMACIÓN DEL USUARIO
   ========================================================= */

interface CurrentUser {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  associatedBank: string;
  currentPassword: string;
  newPassword: string;
}


/* =========================================================
   COMPONENTE PERFIL
   ========================================================= */

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

  private router = inject(Router);


  /* =======================================================
     SELECTOR DE ARCHIVOS
     ======================================================= */

  @ViewChild('fileInput')
  fileInput!: ElementRef<HTMLInputElement>;


  /* =======================================================
     CLAVES DE LOCALSTORAGE
     ======================================================= */

  private readonly USERS_KEY =
    'creditmonitor_users';

  private readonly CURRENT_USER_KEY =
    'creditmonitor_current_user';

  private readonly FOTO_PERFIL_KEY_PREFIX =
    'creditmonitor_foto_perfil_';


  /* =======================================================
     FOTO DE PERFIL
     ======================================================= */

  fotoPerfil: string | undefined;


  /* =======================================================
     USUARIO ACTUAL
     ======================================================= */

  user: CurrentUser = {

    fullName: '',

    username: '',

    email: '',

    password: '',

    phone: '',

    associatedBank: 'Banco Popular',

    currentPassword: '',

    newPassword: ''

  };


  /* =======================================================
     BANCOS
     ======================================================= */

  banks: string[] = [
    'Banco Popular',
    'Banco BHD',
    'Banreservas',
    'Scotiabank'
  ];


  /* =======================================================
     CONSTRUCTOR
     ======================================================= */

  constructor() {

    addIcons({
      personOutline,
      lockClosedOutline,
      person,
      cameraOutline,
      logOutOutline
    });

    this.cargarUsuarioActual();
  }


  /* =======================================================
     AL ENTRAR NUEVAMENTE AL PERFIL
     ======================================================= */

  ionViewWillEnter() {

    this.cargarUsuarioActual();

  }


  /* =======================================================
     OBTENER CLAVE DE LA FOTO
     ======================================================= */

  private obtenerFotoPerfilKey(): string | null {

    if (!this.user.username) {

      return null;

    }

    return (
      this.FOTO_PERFIL_KEY_PREFIX +
      this.user.username
        .trim()
        .toLowerCase()
    );

  }


  /* =======================================================
     CARGAR USUARIO ACTUAL
     ======================================================= */

  private cargarUsuarioActual() {

    const datos =
      localStorage.getItem(
        this.CURRENT_USER_KEY
      );


    if (!datos) {

      this.user = {

        fullName: '',
        username: '',
        email: '',
        password: '',
        phone: '',
        associatedBank: 'Banco Popular',
        currentPassword: '',
        newPassword: ''

      };

      this.fotoPerfil = undefined;

      return;

    }


    try {

      const usuario =
        JSON.parse(datos);


      this.user = {

        fullName:
          usuario.fullName || '',

        username:
          usuario.username || '',

        email:
          usuario.email || '',

        password:
          usuario.password || '',

        phone:
          usuario.phone || '',

        associatedBank:
          usuario.associatedBank ||
          'Banco Popular',

        currentPassword: '',

        newPassword: ''

      };


      this.cargarFotoPerfil();


      console.log(
        'Usuario cargado en Perfil:',
        this.user.username
      );


    } catch (error) {

      console.error(
        'Error cargando usuario actual:',
        error
      );

      this.fotoPerfil = undefined;

    }

  }


  /* =======================================================
     CARGAR FOTO DEL USUARIO
     ======================================================= */

  private cargarFotoPerfil() {

    const key =
      this.obtenerFotoPerfilKey();


    if (!key) {

      this.fotoPerfil = undefined;

      return;

    }


    const fotoGuardada =
      localStorage.getItem(key);


    if (fotoGuardada) {

      this.fotoPerfil =
        fotoGuardada;

    } else {

      /*
       * Usuario nuevo:
       * comienza sin foto.
       */

      this.fotoPerfil =
        undefined;

    }

  }


  /* =======================================================
     CAMBIAR FOTO

     Este método mantiene el nombre que
     actualmente usa tu HTML.
     ======================================================= */

  seleccionarFoto() {

    this.tomarFotoPerfil();

  }


  /* =======================================================
     TOMAR / SELECCIONAR FOTO DE PERFIL

     En Android mostrará la opción para:
     - Tomar foto con la cámara
     - Seleccionar una foto
     ======================================================= */

  async tomarFotoPerfil() {

    try {

      const image =
        await Camera.getPhoto({

          quality: 90,

          allowEditing: false,

          resultType:
            CameraResultType.DataUrl,

          source:
            CameraSource.Prompt

        });


      /*
       * Si el usuario cancela
       * o no se obtiene ninguna imagen.
       */

      if (!image.dataUrl) {

        return;

      }


      /*
       * Mostrar la foto inmediatamente.
       */

      this.fotoPerfil =
        image.dataUrl;


      /*
       * Obtener la clave correspondiente
       * al usuario actualmente autenticado.
       */

      const key =
        this.obtenerFotoPerfilKey();


      /*
       * Guardar la foto asociada
       * exclusivamente a ese usuario.
       */

      if (key) {

        localStorage.setItem(

          key,

          image.dataUrl

        );

      }


      console.log(
        'Foto de perfil guardada para:',
        this.user.username
      );


    } catch (error) {

      console.error(

        'No se pudo tomar o seleccionar la foto de perfil:',

        error

      );

    }

  }


  /* =======================================================
     PROCESAR FOTO SELECCIONADA

     Se mantiene para conservar compatibilidad
     con el HTML actual.
     ======================================================= */

  onFileSelected(event: Event) {

    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    if (!file.type.startsWith('image/')) {

      console.error(
        'El archivo seleccionado no es una imagen.'
      );

      return;

    }


    const reader =
      new FileReader();


    reader.onload = () => {

      const resultado =
        reader.result;


      if (
        typeof resultado !== 'string'
      ) {

        return;

      }


      this.fotoPerfil =
        resultado;


      const key =
        this.obtenerFotoPerfilKey();


      if (key) {

        localStorage.setItem(
          key,
          resultado
        );

      }


      console.log(
        'Foto guardada para:',
        this.user.username
      );

    };


    reader.onerror = () => {

      console.error(
        'No fue posible leer la imagen.'
      );

    };


    reader.readAsDataURL(file);


    input.value = '';

  }


  /* =======================================================
     GUARDAR CAMBIOS DEL PERFIL
     ======================================================= */

  async saveProfile() {

    localStorage.setItem(
      this.CURRENT_USER_KEY,
      JSON.stringify(this.user)
    );


    const datosUsuarios =
      localStorage.getItem(
        this.USERS_KEY
      );


    if (datosUsuarios) {

      try {

        const usuarios =
          JSON.parse(datosUsuarios);


        if (Array.isArray(usuarios)) {

          const indice =
            usuarios.findIndex(
              (usuario: any) =>
                usuario.username
                  ?.toLowerCase() ===
                this.user.username
                  .trim()
                  .toLowerCase()
            );


          if (indice !== -1) {

            usuarios[indice] = {

              ...usuarios[indice],

              fullName:
                this.user.fullName,

              email:
                this.user.email,

              phone:
                this.user.phone,

              associatedBank:
                this.user.associatedBank

            };


            localStorage.setItem(
              this.USERS_KEY,
              JSON.stringify(usuarios)
            );

          }

        }

      } catch (error) {

        console.error(
          'Error actualizando los datos del usuario:',
          error
        );

      }

    }


    const toast =
      await this.toastCtrl.create({

        message:
          'Perfil actualizado correctamente.',

        duration: 2500,

        color: 'success',

        position: 'bottom'

      });


    await toast.present();

  }


  /* =======================================================
     CAMBIAR CONTRASEÑA
     ======================================================= */

  async updatePassword() {

    if (
      !this.user.currentPassword ||
      !this.user.newPassword
    ) {

      const toast =
        await this.toastCtrl.create({

          message:
            'Por favor completa los campos de contraseña.',

          duration: 2500,

          color: 'warning',

          position: 'bottom'

        });


      await toast.present();

      return;

    }


    if (
      this.user.currentPassword !==
      this.user.password
    ) {

      const toast =
        await this.toastCtrl.create({

          message:
            'La contraseña actual no es correcta.',

          duration: 2500,

          color: 'danger',

          position: 'bottom'

        });


      await toast.present();

      return;

    }


    if (
      this.user.newPassword.length < 6
    ) {

      const toast =
        await this.toastCtrl.create({

          message:
            'La nueva contraseña debe tener al menos 6 caracteres.',

          duration: 2500,

          color: 'warning',

          position: 'bottom'

        });


      await toast.present();

      return;

    }


    this.user.password =
      this.user.newPassword;


    localStorage.setItem(
      this.CURRENT_USER_KEY,
      JSON.stringify(this.user)
    );


    const datosUsuarios =
      localStorage.getItem(
        this.USERS_KEY
      );


    if (datosUsuarios) {

      try {

        const usuarios =
          JSON.parse(datosUsuarios);


        if (Array.isArray(usuarios)) {

          const indice =
            usuarios.findIndex(
              (usuario: any) =>
                usuario.username
                  ?.toLowerCase() ===
                this.user.username
                  .trim()
                  .toLowerCase()
            );


          if (indice !== -1) {

            usuarios[indice].password =
              this.user.password;


            localStorage.setItem(
              this.USERS_KEY,
              JSON.stringify(usuarios)
            );

          }

        }

      } catch (error) {

        console.error(
          'Error actualizando la contraseña:',
          error
        );

      }

    }


    const toast =
      await this.toastCtrl.create({

        message:
          'Contraseña cambiada con éxito.',

        duration: 2500,

        color: 'success',

        position: 'bottom'

      });


    await toast.present();


    this.user.currentPassword =
      '';

    this.user.newPassword =
      '';

  }


  /* =======================================================
     CERRAR SESIÓN
     ======================================================= */

  async cerrarSesion() {

    const toast =
      await this.toastCtrl.create({

        message:
          'Sesión cerrada correctamente.',

        duration: 1500,

        color: 'success',

        position: 'bottom'

      });


    await toast.present();


    localStorage.removeItem(
      this.CURRENT_USER_KEY
    );


    this.user = {

      fullName: '',

      username: '',

      email: '',

      password: '',

      phone: '',

      associatedBank: 'Banco Popular',

      currentPassword: '',

      newPassword: ''

    };


    this.fotoPerfil =
      undefined;


    await this.router.navigate(
      ['/welcome'],
      {
        replaceUrl: true
      }
    );

  }

}
