import {
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  AlertController,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonItemOption,
  IonItemOptions,
  IonItemSliding,
  IonLabel,
  IonList,
  IonNote,
  IonRefresher,
  IonRefresherContent,
  IonSelect,
  IonSelectOption,
  IonToolbar,
  ToastController
} from '@ionic/angular';

import { addIcons } from 'ionicons';

import {
  addCircleOutline,
  businessOutline,
  cardOutline,
  cashOutline,
  closeOutline,
  createOutline,
  saveOutline,
  trashOutline,
  walletOutline
} from 'ionicons/icons';

import {
  Deuda,
  DeudasStorageService,
  NuevaDeuda,
  TipoDeuda
} from '../services/deudas-storage.service';


/* =========================================================
   FORMULARIO
   ========================================================= */

interface FormularioDeuda {

  banco: string;

  tipo: TipoDeuda;

  descripcion: string;

  monto: number | null;

  cuotaMensual: number | null;

  ultimos4: string;

}


/* =========================================================
   COMPONENTE
   ========================================================= */

@Component({

  selector: 'app-tab2',

  templateUrl: './tab2.page.html',

  styleUrls: ['./tab2.page.scss'],

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    IonButton,

    IonCard,

    IonCardContent,

    IonCardHeader,

    IonCardSubtitle,

    IonCardTitle,

    IonContent,

    IonHeader,

    IonIcon,

    IonInput,

    IonItem,

    IonItemOption,

    IonItemOptions,

    IonItemSliding,

    IonLabel,

    IonList,

    IonNote,

    IonRefresher,

    IonRefresherContent,

    IonSelect,

    IonSelectOption,

    IonToolbar

  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]

})
export class Tab2Page implements OnInit {


  /* =======================================================
     SERVICIOS
     ======================================================= */

  private readonly storage =
    inject(DeudasStorageService);

  private readonly toastCtrl =
    inject(ToastController);

  private readonly alertCtrl =
    inject(AlertController);


  /* =======================================================
     ESTADO
     ======================================================= */

  deudas: Deuda[] = [];

  mostrarFormulario =
    false;

  editandoId:
    string | null =
    null;

  cargando =
    true;


  /* =======================================================
     FORMULARIO
     ======================================================= */

  formulario:
    FormularioDeuda =
    this.formularioVacio();


  /* =======================================================
     CONSTRUCTOR
     ======================================================= */

  constructor() {

    addIcons({

      addCircleOutline,

      businessOutline,

      cardOutline,

      cashOutline,

      closeOutline,

      createOutline,

      saveOutline,

      trashOutline,

      walletOutline

    });

  }


  /* =======================================================
     INICIALIZACIÓN
     ======================================================= */

  async ngOnInit(): Promise<void> {

    await this.storage.inicializarDatosDemo();

    await this.cargarDeudas();

  }


  /* =======================================================
     ENTRAR NUEVAMENTE A LA PANTALLA
     ======================================================= */

  async ionViewWillEnter(): Promise<void> {

    await this.cargarDeudas();

  }


  /* =======================================================
     CARGAR DEUDAS
     ======================================================= */

  async cargarDeudas(): Promise<void> {

    this.cargando =
      true;


    try {

      this.deudas =
        await this.storage.obtenerTodas();

    } catch (error) {

      console.error(
        'Error cargando deudas:',
        error
      );

      this.deudas =
        [];

    } finally {

      this.cargando =
        false;

    }

  }


  /* =======================================================
     TOTAL DEUDA
     ======================================================= */

  get totalDeuda(): number {

    return this.deudas.reduce(

      (
        total,
        deuda
      ) =>

        total +
        Number(
          deuda.monto || 0
        ),

      0

    );

  }


  /* =======================================================
     TOTAL CUOTAS
     ======================================================= */

  get totalCuotasMensuales(): number {

    return this.deudas.reduce(

      (
        total,
        deuda
      ) =>

        total +
        Number(
          deuda.cuotaMensual || 0
        ),

      0

    );

  }


  /* =======================================================
     ABRIR NUEVA DEUDA
     ======================================================= */

  nuevaDeuda(): void {

    this.editandoId =
      null;


    this.formulario =
      this.formularioVacio();


    this.mostrarFormulario =
      true;

  }


  /* =======================================================
     EDITAR DEUDA
     ======================================================= */

  editar(
    deuda: Deuda
  ): void {

    this.editandoId =
      deuda.id;


    this.formulario = {

      banco:
        deuda.banco,

      tipo:
        deuda.tipo,

      descripcion:
        deuda.descripcion,

      monto:
        deuda.monto,

      cuotaMensual:
        deuda.cuotaMensual,

      ultimos4:
        deuda.ultimos4 ?? ''

    };


    this.mostrarFormulario =
      true;

  }


  /* =======================================================
     CANCELAR
     ======================================================= */

  cancelarEdicion(): void {

    this.editandoId =
      null;


    this.formulario =
      this.formularioVacio();


    this.mostrarFormulario =
      false;

  }


  /* =======================================================
     INPUT BANCO
     ======================================================= */

  actualizarBanco(
    event: CustomEvent
  ): void {

    this.formulario.banco =
      event.detail?.value ?? '';

  }


  /* =======================================================
     INPUT TIPO
     ======================================================= */

  actualizarTipo(
    event: CustomEvent
  ): void {

    const valor =
      event.detail?.value;


    if (
      valor === 'Prestamo' ||
      valor === 'Tarjeta'
    ) {

      this.formulario.tipo =
        valor;

    }

  }


  /* =======================================================
     INPUT DESCRIPCIÓN
     ======================================================= */

  actualizarDescripcion(
    event: CustomEvent
  ): void {

    this.formulario.descripcion =
      event.detail?.value ?? '';

  }


  /* =======================================================
     INPUT MONTO
     ======================================================= */

  actualizarMonto(
    event: CustomEvent
  ): void {

    const valor =
      event.detail?.value;


    if (
      valor === '' ||
      valor === null ||
      valor === undefined
    ) {

      this.formulario.monto =
        null;

      return;

    }


    const numero =
      Number(valor);


    this.formulario.monto =
      Number.isFinite(numero)
        ? numero
        : null;

  }


  /* =======================================================
     INPUT CUOTA MENSUAL
     ======================================================= */

  actualizarCuotaMensual(
    event: CustomEvent
  ): void {

    const valor =
      event.detail?.value;


    if (
      valor === '' ||
      valor === null ||
      valor === undefined
    ) {

      this.formulario.cuotaMensual =
        null;

      return;

    }


    const numero =
      Number(valor);


    this.formulario.cuotaMensual =
      Number.isFinite(numero)
        ? numero
        : null;

  }


  /* =======================================================
     INPUT ÚLTIMOS 4
     ======================================================= */

  actualizarUltimos4(
    event: CustomEvent
  ): void {

    this.formulario.ultimos4 =
      (
        event.detail?.value ?? ''
      )
      .replace(/\D/g, '')
      .slice(0, 4);

  }


  /* =======================================================
     GUARDAR DEUDA
     ======================================================= */

  async guardar(): Promise<void> {

    /*
     * Tomamos los valores directamente
     * del objeto que hemos actualizado
     * mediante ionInput.
     */

    const banco =
      this.formulario.banco
        .trim();


    const descripcion =
      this.formulario.descripcion
        .trim();


    const monto =
      Number(
        this.formulario.monto ?? 0
      );


    const cuotaMensual =
      Number(
        this.formulario.cuotaMensual ?? 0
      );


    console.log(
      'Datos antes de guardar:',
      {
        banco,
        tipo:
          this.formulario.tipo,
        descripcion,
        monto,
        cuotaMensual
      }
    );


    /* -----------------------------------------------------
       VALIDACIÓN
       ----------------------------------------------------- */

    if (
      !banco ||
      !descripcion ||
      monto <= 0
    ) {

      await this.mostrarToast(

        'Completa banco, descripción y un monto mayor que cero.',

        'warning'

      );

      return;

    }


    /* -----------------------------------------------------
       PREPARAR DATOS
       ----------------------------------------------------- */

    const datos:
      NuevaDeuda = {

      banco,

      tipo:
        this.formulario.tipo,

      descripcion,

      monto,

      cuotaMensual:
        Math.max(
          0,
          cuotaMensual
        ),

      ultimos4:

        this.formulario.tipo ===
        'Tarjeta'

          ? this.formulario.ultimos4
              .trim()
              .slice(-4)

          : ''

    };


    try {

      /* ---------------------------------------------------
         ACTUALIZAR
         --------------------------------------------------- */

      if (this.editandoId) {

        await this.storage.actualizar(

          this.editandoId,

          datos

        );


        await this.mostrarToast(

          'Deuda actualizada y guardada en el dispositivo.',

          'success'

        );

      }


      /* ---------------------------------------------------
         CREAR
         --------------------------------------------------- */

      else {

        await this.storage.crear(
          datos
        );


        await this.mostrarToast(

          'Deuda creada y guardada en el dispositivo.',

          'success'

        );

      }


      /* ---------------------------------------------------
         LIMPIAR FORMULARIO
         --------------------------------------------------- */

      this.cancelarEdicion();


      /* ---------------------------------------------------
         RECARGAR LISTA
         --------------------------------------------------- */

      await this.cargarDeudas();


    } catch (error) {

      console.error(
        'Error guardando deuda:',
        error
      );


      await this.mostrarToast(

        'No fue posible guardar la deuda.',

        'danger'

      );

    }

  }


  /* =======================================================
     CONFIRMAR ELIMINACIÓN
     ======================================================= */

  async confirmarEliminar(
    deuda: Deuda
  ): Promise<void> {

    const alert =
      await this.alertCtrl.create({

        header:
          'Eliminar deuda',

        message:
          `¿Deseas eliminar “${deuda.descripcion}” de ${deuda.banco}?`,

        buttons: [

          {

            text:
              'Cancelar',

            role:
              'cancel'

          },

          {

            text:
              'Eliminar',

            role:
              'destructive',

            handler: () => {

              void this.eliminar(
                deuda.id
              );

            }

          }

        ]

      });


    await alert.present();

  }


  /* =======================================================
     ELIMINAR
     ======================================================= */

  async eliminar(
    id: string
  ): Promise<void> {

    try {

      const eliminado =
        await this.storage.eliminar(
          id
        );


      if (eliminado) {

        await this.cargarDeudas();


        await this.mostrarToast(

          'Deuda eliminada correctamente.',

          'success'

        );

      }

    } catch (error) {

      console.error(
        'Error eliminando deuda:',
        error
      );


      await this.mostrarToast(

        'No fue posible eliminar la deuda.',

        'danger'

      );

    }

  }


  /* =======================================================
     REFRESCAR
     ======================================================= */

  async refrescar(
    event: any
  ): Promise<void> {

    try {

      await this.cargarDeudas();

    } finally {

      event?.target?.complete?.();

    }

  }


  /* =======================================================
     FORMULARIO VACÍO
     ======================================================= */

  private formularioVacio():
    FormularioDeuda {

    return {

      banco:
        '',

      tipo:
        'Prestamo',

      descripcion:
        '',

      monto:
        null,

      cuotaMensual:
        null,

      ultimos4:
        ''

    };

  }


  /* =======================================================
     TOAST
     ======================================================= */

  private async mostrarToast(

    message: string,

    color:
      'success' |
      'warning' |
      'danger' =
      'success'

  ): Promise<void> {

    const toast =
      await this.toastCtrl.create({

        message,

        duration:
          2200,

        color,

        position:
          'bottom'

      });


    await toast.present();

  }

}