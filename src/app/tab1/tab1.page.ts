import {
  Component,
  OnInit,
  OnDestroy,
  inject,
  CUSTOM_ELEMENTS_SCHEMA,
  ChangeDetectorRef
} from '@angular/core';

import {
  ApiPost,
  ApiService
} from '../services/api.service';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import {
  ToastController,
  ModalController
} from '@ionic/angular';

import {
  PayModalComponent
} from '../pages/tab1/components/pay-modal/pay-modal.component';

import {
  StatementModalComponent
} from '../pages/tab1/components/statement-modal/statement-modal.component';

import {
  TransferModalComponent
} from '../pages/tab1/components/transfer-modal/transfer-modal.component';

import {
  NotificationsModalComponent
} from './notifications-modal/notifications-modal.component';

import {
  NfcBleModalComponent
} from '../pages/tab1/components/nfc-ble-modal/nfc-ble-modal.component';

import {
  GeoMapModalComponent
} from '../pages/tab1/components/geo-map-modal/geo-map-modal.component';

import { addIcons } from 'ionicons';

import {
  personCircleOutline,
  notificationsOutline,
  shieldCheckmarkOutline,
  wifiOutline,
  walletOutline,
  lockClosedOutline,
  lockOpenOutline,
  documentTextOutline,
  swapHorizontalOutline,
  calendarOutline,
  timeOutline,
  cartOutline,
  tvOutline,
  sparklesOutline,
  carOutline,
  hardwareChipOutline,
  calendarNumberOutline,
  closeOutline,
  checkmarkDoneOutline,
  trashOutline,
  chevronDownCircleOutline,
  eyeOutline,
  wifi,
  mapOutline,
  cloudDownloadOutline,
  cloudUploadOutline
} from 'ionicons/icons';

import { firstValueFrom } from 'rxjs';


/* =========================================================
   INTERFAZ TARJETA
   ========================================================= */

interface CreditCard {
  id: number;
  cardName: string;
  cardNumber: string;
  balance: number;
  limit: number;
  dueDate: string;
  cutOffDate: string;
  type: string;
  colorClass: string;
  isFrozen: boolean;
}


/* =========================================================
   INTERFAZ TRANSACCIÓN
   ========================================================= */

interface Transaction {
  id: number;
  title: string;
  category: string;
  amount: number;
  date: string;
  type: 'expense' | 'income';
  icon: string;
  cardId: number;
  period: 'month' | 'quarter' | 'year';
}


/* =========================================================
   COMPONENTE
   ========================================================= */

@Component({
  selector: 'app-tab1',

  templateUrl: './tab1.page.html',

  styleUrls: ['./tab1.page.scss'],

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab1Page
  implements OnInit, OnDestroy {


  /* =======================================================
     SERVICIOS
     ======================================================= */

  private toastCtrl =
    inject(ToastController);

  private modalCtrl =
    inject(ModalController);

  private readonly apiService =
    inject(ApiService);

  private cdr =
    inject(ChangeDetectorRef);


  /* =======================================================
     ESTADO DE CONECTIVIDAD
     ======================================================= */

  isOnline: boolean =
    navigator.onLine;

  private onlineHandler =
    () => this.isOnline = true;

  private offlineHandler =
    () => this.isOnline = false;


  /* =======================================================
     DATOS DEL DASHBOARD
     ======================================================= */

  userName: string = 'Usuario';

  creditScore: number =
    765;

  selectedPeriod:
    'month' |
    'quarter' |
    'year' =
    'month';


  /* =======================================================
     DATOS DE SERVICIOS WEB
     ======================================================= */

  publicacionesApi: ApiPost[] =
    [];

  cargandoApi =
    false;

  errorApi =
    '';

  publicacionCreada:
    ApiPost | null =
    null;


  /* =======================================================
     TARJETAS
     ======================================================= */

  cards: CreditCard[] = [

    {
      id: 1,

      cardName:
        'Banreservas Gold',

      cardNumber:
        '•••• 4821',

      balance:
        1450.80,

      limit:
        5000.00,

      dueDate:
        '15 Oct 2026',

      cutOffDate:
        '02 Oct 2026',

      type:
        'VISA',

      colorClass:
        'card-gold',

      isFrozen:
        false
    },


    {
      id: 2,

      cardName:
        'Popular Black',

      cardNumber:
        '•••• 8902',

      balance:
        3200.00,

      limit:
        15000.00,

      dueDate:
        '22 Oct 2026',

      cutOffDate:
        '08 Oct 2026',

      type:
        'Mastercard',

      colorClass:
        'card-black',

      isFrozen:
        false
    }

  ];


  /* =======================================================
     TARJETA SELECCIONADA
     ======================================================= */

  selectedCard:
    CreditCard =
    this.cards[0];


  /* =======================================================
     TRANSACCIONES
     ======================================================= */

  transactions: Transaction[] = [

    {
      id: 1,

      title:
        'Supermercado Nacional',

      category:
        'Compras',

      amount:
        125.40,

      date:
        'Hoy, 3:15 PM',

      type:
        'expense',

      icon:
        'cart-outline',

      cardId:
        1,

      period:
        'month'
    },


    {
      id: 2,

      title:
        'Netflix Subscription',

      category:
        'Entretenimiento',

      amount:
        15.99,

      date:
        'Ayer',

      type:
        'expense',

      icon:
        'tv-outline',

      cardId:
        1,

      period:
        'month'
    },


    {
      id: 3,

      title:
        'Cashback CreditMonitor',

      category:
        'Recompensa',

      amount:
        45.00,

      date:
        '18 Sep',

      type:
        'income',

      icon:
        'sparkles-outline',

      cardId:
        1,

      period:
        'month'
    },


    {
      id: 4,

      title:
        'Gasolinera Shell',

      category:
        'Transporte',

      amount:
        50.00,

      date:
        '16 Sep',

      type:
        'expense',

      icon:
        'car-outline',

      cardId:
        1,

      period:
        'quarter'
    },


    {
      id: 5,

      title:
        'Apple Store',

      category:
        'Tecnología',

      amount:
        299.00,

      date:
        '12 Sep',

      type:
        'expense',

      icon:
        'hardware-chip-outline',

      cardId:
        2,

      period:
        'month'
    },


    {
      id: 6,

      title:
        'IKEA Santo Domingo',

      category:
        'Hogar',

      amount:
        480.00,

      date:
        '14 Jul',

      type:
        'expense',

      icon:
        'cart-outline',

      cardId:
        1,

      period:
        'quarter'
    },


    {
      id: 7,

      title:
        'Vuelo Arajet',

      category:
        'Viajes',

      amount:
        350.00,

      date:
        '02 Mar',

      type:
        'expense',

      icon:
        'car-outline',

      cardId:
        1,

      period:
        'year'
    },


    {
      id: 8,

      title:
        'Mantenimiento Vehículo',

      category:
        'Servicios',

      amount:
        210.00,

      date:
        '15 Feb',

      type:
        'expense',

      icon:
        'car-outline',

      cardId:
        2,

      period:
        'year'
    }

  ];


  /* =======================================================
     CONSTRUCTOR
     ======================================================= */

  constructor() {

    addIcons({

      personCircleOutline,

      notificationsOutline,

      shieldCheckmarkOutline,

      wifiOutline,

      wifi,

      walletOutline,

      lockClosedOutline,

      lockOpenOutline,

      documentTextOutline,

      swapHorizontalOutline,

      calendarOutline,

      timeOutline,

      cartOutline,

      tvOutline,

      sparklesOutline,

      carOutline,

      hardwareChipOutline,

      calendarNumberOutline,

      closeOutline,

      checkmarkDoneOutline,

      trashOutline,

      chevronDownCircleOutline,

      eyeOutline,

      mapOutline,

      cloudDownloadOutline,

      cloudUploadOutline

    });

  }


  /* =======================================================
     INICIALIZACIÓN
     ======================================================= */

  ngOnInit() {

    this.loadUserData();


    window.addEventListener(
      'online',
      this.onlineHandler
    );


    window.addEventListener(
      'offline',
      this.offlineHandler
    );

  }


  /* =======================================================
     GET - OBTENER PUBLICACIONES
     ======================================================= */

 async cargarDatosAPI() {

  this.cargandoApi = true;
  this.errorApi = '';
  this.publicacionesApi = [];
  this.publicacionCreada = null;

  this.cdr.detectChanges();

  console.log('Iniciando petición GET...');

  try {

    /*
     * Realizar petición GET a la API
     */
    const respuesta =
      await firstValueFrom(
        this.apiService.obtenerPublicaciones()
      );

    console.log(
      'Respuesta original de la API:',
      respuesta
    );


    /*
     * Tomamos las primeras 5 publicaciones
     * recibidas desde la API.
     */
    const publicaciones =
      respuesta.slice(0, 5);


    /*
     * Textos en español para mostrar
     * la información de forma más adecuada
     * para nuestra aplicación.
     *
     * IMPORTANTE:
     * Los datos siguen viniendo de la API.
     * Solamente traducimos el contenido
     * que mostramos en pantalla.
     */
    const textosEspanol = [

      {
        title:
          'Consejos para mejorar tus finanzas',

        body:
          'Aprende a organizar tus ingresos y controlar mejor tus gastos para mantener unas finanzas saludables.'
      },

      {
        title:
          'Importancia del ahorro',

        body:
          'Ahorrar una parte de tus ingresos te permite prepararte para emergencias y alcanzar tus metas financieras.'
      },

      {
        title:
          'Cómo controlar tus gastos',

        body:
          'Llevar un registro de tus gastos ayuda a identificar en qué estás utilizando tu dinero y dónde puedes reducir gastos innecesarios.'
      },

      {
        title:
          'Uso responsable del crédito',

        body:
          'Utilizar el crédito de manera responsable puede ayudarte a mantener un buen historial y evitar un endeudamiento excesivo.'
      },

      {
        title:
          'Planificación financiera',

        body:
          'Crear un presupuesto mensual facilita la organización de tus ingresos, gastos y objetivos financieros.'
      }

    ];


    /*
     * Combinar los datos recibidos
     * con los textos en español.
     */
    this.publicacionesApi =
      publicaciones.map(
        (publicacion, index) => ({

          ...publicacion,

          title:
            textosEspanol[index]?.title
            ||
            publicacion.title,

          body:
            textosEspanol[index]?.body
            ||
            publicacion.body

        })
      );


    console.log(
      'Datos mostrados en español:',
      this.publicacionesApi
    );


    /*
     * Actualizar la interfaz
     */
    this.cdr.detectChanges();


    /*
     * Mostrar mensaje de éxito
     */
    const toast =
      await this.toastCtrl.create({

        message:
          `¡GET exitoso! Se cargaron ${this.publicacionesApi.length} publicaciones.`,

        duration:
          3000,

        position:
          'bottom',

        color:
          'success'

      });


    await toast.present();


  } catch (error) {

    console.error(
      'Error en GET:',
      error
    );


    this.errorApi =
      'No fue posible obtener los datos de la API.';


    this.cdr.detectChanges();


    const toast =
      await this.toastCtrl.create({

        message:
          'No se pudieron obtener los datos de la API.',

        duration:
          3000,

        position:
          'bottom',

        color:
          'danger'

      });


    await toast.present();


  } finally {

    /*
     * Ocultar siempre el indicador
     * de "Procesando petición..."
     */
    this.cargandoApi =
      false;

    this.cdr.detectChanges();

    console.log(
      'Petición GET finalizada.'
    );

  }

}

  /* =======================================================
     POST - CREAR PUBLICACIÓN
     ======================================================= */

  async probarPOST() {

    this.cargandoApi =
      true;

    this.errorApi =
      '';

    this.publicacionCreada =
      null;


    this.cdr.detectChanges();


    /*
     * Datos que enviaremos
     */

    const nuevaPublicacion =
      {

        title:
          'Nueva Publicación Ionic',

        body:
          'Contenido de prueba enviado mediante método POST.',

        userId:
          1

      };


    console.log(
      'Iniciando petición POST...'
    );


    try {

      /*
       * Ejecutar POST
       */

      const respuesta =
        await firstValueFrom(

          this.apiService
            .crearPublicacion(
              nuevaPublicacion
            )

        );


      console.log(
        'Respuesta POST:',
        respuesta
      );


      /*
       * Guardar respuesta
       */

      this.publicacionCreada =
        respuesta;


      /*
       * Actualizar interfaz
       */

      this.cdr.detectChanges();


      /*
       * Mostrar confirmación
       */

      const toast =
        await this.toastCtrl.create({

          message:
            `¡POST exitoso! Creado ID: ${respuesta.id}.`,

          duration:
            4000,

          position:
            'bottom',

          color:
            'success'

        });


      await toast.present();


    } catch (error) {

      console.error(
        'Error en POST:',
        error
      );


      this.errorApi =
        'No fue posible enviar los datos a la API.';


      this.cdr.detectChanges();


      const toast =
        await this.toastCtrl.create({

          message:
            'Error al enviar la publicación (POST).',

          duration:
            3000,

          position:
            'bottom',

          color:
            'danger'

        });


      await toast.present();


    } finally {

      /*
       * SIEMPRE ocultar el indicador
       */

      this.cargandoApi =
        false;


      this.cdr.detectChanges();


      console.log(
        'Petición POST finalizada.'
      );

    }

  }


  /* =======================================================
     DESTRUCCIÓN
     ======================================================= */

  ngOnDestroy() {

    window.removeEventListener(
      'online',
      this.onlineHandler
    );


    window.removeEventListener(
      'offline',
      this.offlineHandler
    );

  }


  /* =======================================================
     AL VOLVER AL DASHBOARD
     ======================================================= */

  ionViewWillEnter() {

    this.loadUserData();

  }


  /* =======================================================
     CARGAR DATOS DEL USUARIO
     ======================================================= */

  loadUserData() {

  /*
   * Obtener el usuario que inició sesión
   */
  const currentUserData =
    localStorage.getItem(
      'creditmonitor_current_user'
    );


  if (currentUserData) {

    try {

      const currentUser =
        JSON.parse(currentUserData);


      /*
       * Usar el nombre completo del usuario.
       * Si no existe, usar el nombre de usuario.
       */

      if (currentUser.fullName) {

        this.userName =
          currentUser.fullName;

      } else if (currentUser.username) {

        this.userName =
          currentUser.username;

      }


      console.log(
        'Usuario mostrado en Dashboard:',
        this.userName
      );


      return;

    } catch (error) {

      console.error(
        'Error leyendo el usuario actual:',
        error
      );

    }

  }


  /*
   * Compatibilidad con versiones anteriores
   * del proyecto.
   */

  const savedName =
    localStorage.getItem('user_name')
    ||
    localStorage.getItem('userName');


  if (savedName) {

    this.userName =
      savedName;

  }

}


  /* =======================================================
     MAPA GPS
     ======================================================= */

  async abrirMapaGPS() {

    try {

      const modal =
        await this.modalCtrl.create({

          component:
            GeoMapModalComponent,

          breakpoints:
            [0, 0.85, 1],

          initialBreakpoint:
            0.85

        });


      await modal.present();


    } catch (error) {

      console.error(
        'Error al abrir el mapa GPS:',
        error
      );

    }

  }


  /* =======================================================
     NFC / BLE
     ======================================================= */

  async openNfcBleModal() {

    try {

      const modal =
        await this.modalCtrl.create({

          component:
            NfcBleModalComponent,

          breakpoints:
            [0, 0.85, 1],

          initialBreakpoint:
            0.85

        });


      await modal.present();


    } catch (error) {

      console.error(
        'Error al abrir el modal de NFC/BLE:',
        error
      );

    }

  }


  /* =======================================================
     NOTIFICACIONES
     ======================================================= */

  async openNotificationsModal() {

    try {

      const modal =
        await this.modalCtrl.create({

          component:
            NotificationsModalComponent,

          componentProps:
            {
              cards:
                this.cards
            },

          breakpoints:
            [0, 0.85, 1],

          initialBreakpoint:
            0.85

        });


      await modal.present();


    } catch (error) {

      console.error(
        'Error al abrir el modal de notificaciones:',
        error
      );

    }

  }


  /* =======================================================
     CAMBIAR PERIODO
     ======================================================= */

  async setPeriod(
    period:
      'month' |
      'quarter' |
      'year'
  ) {

    this.selectedPeriod =
      period;


    const labelMap = {

      month:
        'Este Mes',

      quarter:
        'Último Trimestre',

      year:
        'Año 2026'

    };


    const toast =
      await this.toastCtrl.create({

        message:
          `Mostrando movimientos de: ${labelMap[period]}`,

        duration:
          1800,

        position:
          'bottom',

        color:
          'dark'

      });


    await toast.present();

  }


  /* =======================================================
     TRANSACCIONES FILTRADAS
     ======================================================= */

  get filteredTransactions():
    Transaction[] {

    return this.transactions.filter(
      t => {

        const matchCard =
          t.cardId ===
          this.selectedCard.id;


        if (
          this.selectedPeriod ===
          'month'
        ) {

          return (
            matchCard &&
            t.period === 'month'
          );

        }


        else if (
          this.selectedPeriod ===
          'quarter'
        ) {

          return (

            matchCard &&

            (
              t.period === 'month' ||
              t.period === 'quarter'
            )

          );

        }


        else {

          return matchCard;

        }

      }
    );

  }


  /* =======================================================
     CASHBACK
     ======================================================= */

  get periodCashback():
    number {

    const totalSpent =
      this.filteredTransactions

        .filter(
          t =>
            t.type ===
            'expense'
        )

        .reduce(
          (
            sum,
            t
          ) =>
            sum + t.amount,

          0
        );


    return (
      totalSpent * 0.02
    );

  }


  /* =======================================================
     ETIQUETA SCORE
     ======================================================= */

  get scoreLabel():
    string {

    if (
      this.creditScore >=
      750
    ) {

      return 'Excelente';

    }


    if (
      this.creditScore >=
      700
    ) {

      return 'Bueno';

    }


    if (
      this.creditScore >=
      650
    ) {

      return 'Regular';

    }


    return 'Riesgo';

  }


  /* =======================================================
     COLOR SCORE
     ======================================================= */

  get scoreColor():
    string {

    if (
      this.creditScore >=
      750
    ) {

      return '#00e676';

    }


    if (
      this.creditScore >=
      700
    ) {

      return '#38b6ff';

    }


    if (
      this.creditScore >=
      650
    ) {

      return '#e08b2b';

    }


    return '#ff5252';

  }


  /* =======================================================
     CRÉDITO DISPONIBLE
     ======================================================= */

  getAvailableCredit(
    card: CreditCard
  ):
    number {

    return (
      card.limit -
      card.balance
    );

  }


  /* =======================================================
     PORCENTAJE DE USO
     ======================================================= */

  getUsagePercentage(
    card: CreditCard
  ):
    number {

    return Math.round(

      (
        card.balance /
        card.limit
      ) * 100

    );

  }


  /* =======================================================
     SELECCIONAR TARJETA
     ======================================================= */

  selectCard(
    card: CreditCard
  ) {

    this.selectedCard =
      card;

  }


  /* =======================================================
     CONGELAR / DESCONGELAR TARJETA
     ======================================================= */

  async toggleFreezeCard() {

    this.selectedCard.isFrozen =
      !this.selectedCard.isFrozen;


    let msg =
      '';


    if (
      this.selectedCard.isFrozen
    ) {

      msg =
        this.isOnline

          ? `La tarjeta ${this.selectedCard.cardName} fue congelada temporalmente.`

          : `La tarjeta ${this.selectedCard.cardName} se congeló localmente. Se sincronizará al recuperar conexión.`;

    }


    else {

      msg =
        this.isOnline

          ? `La tarjeta ${this.selectedCard.cardName} está activa nuevamente.`

          : `La tarjeta ${this.selectedCard.cardName} se descongeló localmente. Se sincronizará al recuperar conexión.`;

    }


    const toast =
      await this.toastCtrl.create({

        message:
          msg,

        duration:
          3000,

        position:
          'bottom',

        color:
          this.selectedCard.isFrozen
            ? 'warning'
            : 'success'

      });


    await toast.present();

  }


  /* =======================================================
     ESTADO DE CUENTA
     ======================================================= */

  async openStatementModal() {

    try {

      const modal =
        await this.modalCtrl.create({

          component:
            StatementModalComponent,

          componentProps:
            {
              card:
                {
                  ...this.selectedCard
                }
            }

        });


      await modal.present();


    } catch (error) {

      console.error(
        'Error al abrir el estado de cuenta:',
        error
      );

    }

  }


  /* =======================================================
     TRANSFERENCIA
     ======================================================= */

  async openTransferModal() {

    if (!this.isOnline) {

      const toast =
        await this.toastCtrl.create({

          message:
            'Esta función requiere conexión a internet para procesar la transacción de forma segura.',

          duration:
            3500,

          position:
            'bottom',

          color:
            'warning'

        });


      await toast.present();

      return;

    }


    try {

      const modal =
        await this.modalCtrl.create({

          component:
            TransferModalComponent,

          componentProps:
            {
              sourceCard:
                this.selectedCard,

              allCards:
                this.cards
            }

        });


      await modal.present();


      const {
        data,
        role
      } =
        await modal.onDidDismiss();


      const resData =
        data as any;


      if (
        role ===
        'confirm'
        &&
        resData
      ) {

        const transferAmount =
          Number(
            resData.amount
          )
          || 0;


        const targetCard =
          this.cards.find(

            c =>
              c.id ===
              resData.targetCardId

          );


        if (targetCard) {

          this.selectedCard.balance +=
            transferAmount;


          targetCard.balance =
            Math.max(
              0,
              targetCard.balance -
              transferAmount
            );


          this.transactions.unshift({

            id:
              Date.now(),

            title:
              `Transferencia a ${targetCard.cardName}`,

            category:
              'Transferencia',

            amount:
              transferAmount,

            date:
              'Hoy',

            type:
              'expense',

            icon:
              'swap-horizontal-outline',

            cardId:
              this.selectedCard.id,

            period:
              'month'

          });


          this.transactions.unshift({

            id:
              Date.now() + 1,

            title:
              `Abono desde ${this.selectedCard.cardName}`,

            category:
              'Transferencia',

            amount:
              transferAmount,

            date:
              'Hoy',

            type:
              'income',

            icon:
              'swap-horizontal-outline',

            cardId:
              targetCard.id,

            period:
              'month'

          });


          const toast =
            await this.toastCtrl.create({

              message:
                `¡Transferencia de $${transferAmount.toFixed(2)} realizada con éxito!`,

              duration:
                3000,

              color:
                'success',

              position:
                'bottom'

            });


          await toast.present();

        }

      }


    } catch (error) {

      console.error(
        'Error al abrir el modal de transferencia:',
        error
      );

    }

  }


  /* =======================================================
     PAGAR
     ======================================================= */

  async makePayment() {

    if (!this.isOnline) {

      const toast =
        await this.toastCtrl.create({

          message:
            'Esta función requiere conexión a internet para procesar la transacción de forma segura.',

          duration:
            3500,

          position:
            'bottom',

          color:
            'warning'

        });


      await toast.present();

      return;

    }


    try {

      const modal =
        await this.modalCtrl.create({

          component:
            PayModalComponent,

          componentProps:
            {
              card:
                {
                  ...this.selectedCard
                }
            }

        });


      await modal.present();


      const {
        data,
        role
      } =
        await modal.onDidDismiss();


      const resData =
        data as any;


      if (
        role ===
        'confirm'
        &&
        resData
      ) {

        const paidAmount =
          Number(
            resData.amount
          )
          || 0;


        const targetCard =
          this.cards.find(

            c =>
              c.id ===
              (
                resData.cardId
                ||
                this.selectedCard.id
              )

          );


        if (targetCard) {

          targetCard.balance =
            Math.max(
              0,
              targetCard.balance -
              paidAmount
            );


          this.selectedCard =
            targetCard;

        }


        this.transactions.unshift({

          id:
            Date.now(),

          title:
            `Pago - ${this.selectedCard.cardName}`,

          category:
            'Abono',

          amount:
            paidAmount,

          date:
            'Hoy',

          type:
            'income',

          icon:
            'wallet-outline',

          cardId:
            this.selectedCard.id,

          period:
            'month'

        });


        const toast =
          await this.toastCtrl.create({

            message:
              `¡Pago de $${paidAmount.toFixed(2)} realizado con éxito!`,

            duration:
              3000,

            color:
              'success',

            position:
              'bottom'

          });


        await toast.present();

      }


    } catch (error) {

      console.error(
        'Error al abrir el modal:',
        error
      );

    }

  }


  /* =======================================================
     PULL TO REFRESH
     ======================================================= */

  async handleRefresh(
    event: any
  ) {

    setTimeout(
      async () => {

        this.loadUserData();


        event.target.complete();


        const toast =
          await this.toastCtrl.create({

            message:
              'Saldos y movimientos actualizados.',

            duration:
              1500,

            position:
              'bottom',

            color:
              'dark'

          });


        await toast.present();


      },

      1200

    );

  }


  /* =======================================================
     VER RECIBO
     ======================================================= */

  async verRecibo(
    tx: Transaction
  ) {

    const toast =
      await this.toastCtrl.create({

        message:
          `Comprobante: ${tx.title} - $${tx.amount.toFixed(2)} (${tx.category})`,

        duration:
          2500,

        position:
          'bottom',

        color:
          'dark'

      });


    await toast.present();

  }


  /* =======================================================
     REPORTAR MOVIMIENTO
     ======================================================= */

  async reportarMovimiento(
    tx: Transaction
  ) {

    this.transactions =
      this.transactions.filter(

        t =>
          t.id !==
          tx.id

      );


    const toast =
      await this.toastCtrl.create({

        message:
          `Se ha enviado el reporte para "${tx.title}".`,

        duration:
          2000,

        position:
          'bottom',

        color:
          'danger'

      });


    await toast.present();

  }

}