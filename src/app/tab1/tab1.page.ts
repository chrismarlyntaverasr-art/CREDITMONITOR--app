import { Component, OnInit, OnDestroy, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ApiPost, ApiService } from '../services/api.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastController, ModalController } from '@ionic/angular';
import { PayModalComponent } from '../pages/tab1/components/pay-modal/pay-modal.component';
import { StatementModalComponent } from '../pages/tab1/components/statement-modal/statement-modal.component';
import { TransferModalComponent } from '../pages/tab1/components/transfer-modal/transfer-modal.component';
import { NotificationsModalComponent } from './notifications-modal/notifications-modal.component';
import { NfcBleModalComponent } from '../pages/tab1/components/nfc-ble-modal/nfc-ble-modal.component';
import { GeoMapModalComponent } from '../pages/tab1/components/geo-map-modal/geo-map-modal.component';
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
  mapOutline
} from 'ionicons/icons';

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
export class Tab1Page implements OnInit, OnDestroy {
  private toastCtrl = inject(ToastController);
  private modalCtrl = inject(ModalController);
  private readonly apiService = inject(ApiService);

  // --- ESTADO DE CONECTIVIDAD DE RED ---
  isOnline: boolean = navigator.onLine;
  private onlineHandler = () => this.isOnline = true;
  private offlineHandler = () => this.isOnline = false;

  userName: string = 'Chrismarlyn';
  creditScore: number = 765;
  selectedPeriod: 'month' | 'quarter' | 'year' = 'month';
  publicacionesApi: ApiPost[] = [];
  cargandoApi = false;
  errorApi = '';
  publicacionCreada: ApiPost | null = null;

  cards: CreditCard[] = [
    {
      id: 1,
      cardName: 'Banreservas Gold',
      cardNumber: '•••• 4821',
      balance: 1450.80,
      limit: 5000.00,
      dueDate: '15 Oct 2026',
      cutOffDate: '02 Oct 2026',
      type: 'VISA',
      colorClass: 'card-gold',
      isFrozen: false
    },
    {
      id: 2,
      cardName: 'Popular Black',
      cardNumber: '•••• 8902',
      balance: 3200.00,
      limit: 15000.00,
      dueDate: '22 Oct 2026',
      cutOffDate: '08 Oct 2026',
      type: 'Mastercard',
      colorClass: 'card-black',
      isFrozen: false
    }
  ];

  selectedCard: CreditCard = this.cards[0];

  transactions: Transaction[] = [
    { id: 1, title: 'Supermercado Nacional', category: 'Compras', amount: 125.40, date: 'Hoy, 3:15 PM', type: 'expense', icon: 'cart-outline', cardId: 1, period: 'month' },
    { id: 2, title: 'Netflix Subscription', category: 'Entretenimiento', amount: 15.99, date: 'Ayer', type: 'expense', icon: 'tv-outline', cardId: 1, period: 'month' },
    { id: 3, title: 'Cashback CreditMonitor', category: 'Recompensa', amount: 45.00, date: '18 Sep', type: 'income', icon: 'sparkles-outline', cardId: 1, period: 'month' },
    { id: 4, title: 'Gasolinera Shell', category: 'Transporte', amount: 50.00, date: '16 Sep', type: 'expense', icon: 'car-outline', cardId: 1, period: 'quarter' },
    { id: 5, title: 'Apple Store', category: 'Tecnología', amount: 299.00, date: '12 Sep', type: 'expense', icon: 'hardware-chip-outline', cardId: 2, period: 'month' },
    { id: 6, title: 'IKEA Santo Domingo', category: 'Hogar', amount: 480.00, date: '14 Jul', type: 'expense', icon: 'cart-outline', cardId: 1, period: 'quarter' },
    { id: 7, title: 'Vuelo Arajet', category: 'Viajes', amount: 350.00, date: '02 Mar', type: 'expense', icon: 'car-outline', cardId: 1, period: 'year' },
    { id: 8, title: 'Mantenimiento Vehículo', category: 'Servicios', amount: 210.00, date: '15 Feb', type: 'expense', icon: 'car-outline', cardId: 2, period: 'year' }
  ];

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
      mapOutline
    });
  }

  ngOnInit() {
    this.loadUserData();

    // Eventos para detectar cambios de red
    window.addEventListener('online', this.onlineHandler);
    window.addEventListener('offline', this.offlineHandler);
  }

  async cargarDatosAPI() {
    this.cargandoApi = true;
    this.errorApi = '';

    this.apiService.obtenerPublicaciones().subscribe({
      next: async (respuesta) => {
        this.publicacionesApi = respuesta.slice(0, 5);
        this.cargandoApi = false;

        // Mostrar aviso flotante de éxito
        const toast = await this.toastCtrl.create({
          message: `¡GET exitoso! Se cargaron ${this.publicacionesApi.length} publicaciones.`,
          duration: 3000,
          position: 'bottom',
          color: 'success'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Error en GET:', error);
        this.cargandoApi = false;

        // Mostrar aviso flotante de error
        const toast = await this.toastCtrl.create({
          message: 'No se pudieron obtener los datos de la API.',
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }

  async probarPOST() {
    this.cargandoApi = true;
    const nuevaPublicacion = {
      title: 'Nueva Publicación Ionic',
      body: 'Contenido de prueba enviado mediante método POST.',
      userId: 1
    };

    this.apiService.crearPublicacion(nuevaPublicacion).subscribe({
      next: async (respuesta) => {
        this.publicacionCreada = respuesta;
        this.cargandoApi = false;

        // Mostrar aviso flotante con los datos del POST
        const toast = await this.toastCtrl.create({
          message: `¡POST exitoso! Creado ID: ${respuesta.id} - "${respuesta.title}"`,
          duration: 4000,
          position: 'bottom',
          color: 'tertiary'
        });
        await toast.present();
      },
      error: async (error) => {
        console.error('Error en POST:', error);
        this.cargandoApi = false;

        const toast = await this.toastCtrl.create({
          message: 'Error al enviar la publicación (POST).',
          duration: 3000,
          position: 'bottom',
          color: 'danger'
        });
        await toast.present();
      }
    });
  }
  ngOnDestroy() {
    // Limpieza de eventos
    window.removeEventListener('online', this.onlineHandler);
    window.removeEventListener('offline', this.offlineHandler);
  }

  ionViewWillEnter() {
    this.loadUserData();
  }

  loadUserData() {
    const savedName = localStorage.getItem('user_name') || localStorage.getItem('userName');
    if (savedName) {
      this.userName = savedName;
    }
  }

  // --- MÓDULO: APERTURA DEL MODAL MAPA GPS Y SUCURSALES ---
  async abrirMapaGPS() {
    try {
      const modal = await this.modalCtrl.create({
        component: GeoMapModalComponent,
        breakpoints: [0, 0.85, 1],
        initialBreakpoint: 0.85
      });
      await modal.present();
    } catch (error) {
      console.error('Error al abrir el mapa GPS:', error);
    }
  }

  // --- MÓDULO 5: APERTURA DEL MODAL BLE / NFC ---
  async openNfcBleModal() {
    try {
      const modal = await this.modalCtrl.create({
        component: NfcBleModalComponent,
        breakpoints: [0, 0.85, 1],
        initialBreakpoint: 0.85
      });
      await modal.present();
    } catch (error) {
      console.error('Error al abrir el modal de NFC/BLE:', error);
    }
  }

  // --- MÓDULO DE NOTIFICACIONES ---
  async openNotificationsModal() {
    try {
      const modal = await this.modalCtrl.create({
        component: NotificationsModalComponent,
        componentProps: {
          cards: this.cards
        },
        breakpoints: [0, 0.85, 1],
        initialBreakpoint: 0.85
      });
      await modal.present();
    } catch (error) {
      console.error('Error al abrir el modal de notificaciones:', error);
    }
  }

  // --- LÓGICA DE FILTRADO POR PERÍODO Y TARJETA ---
  async setPeriod(period: 'month' | 'quarter' | 'year') {
    this.selectedPeriod = period;
    
    const labelMap = {
      month: 'Este Mes',
      quarter: 'Último Trimestre',
      year: 'Año 2026'
    };

    const toast = await this.toastCtrl.create({
      message: `Mostrando movimientos de: ${labelMap[period]}`,
      duration: 1800,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  get filteredTransactions(): Transaction[] {
    return this.transactions.filter(t => {
      const matchCard = t.cardId === this.selectedCard.id;

      if (this.selectedPeriod === 'month') {
        return matchCard && t.period === 'month';
      } else if (this.selectedPeriod === 'quarter') {
        return matchCard && (t.period === 'month' || t.period === 'quarter');
      } else {
        return matchCard;
      }
    });
  }

  get periodCashback(): number {
    const totalSpent = this.filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return totalSpent * 0.02;
  }

  get scoreLabel(): string {
    if (this.creditScore >= 750) return 'Excelente';
    if (this.creditScore >= 700) return 'Bueno';
    if (this.creditScore >= 650) return 'Regular';
    return 'Riesgo';
  }

  get scoreColor(): string {
    if (this.creditScore >= 750) return '#00e676';
    if (this.creditScore >= 700) return '#38b6ff';
    if (this.creditScore >= 650) return '#e08b2b';
    return '#ff5252';
  }

  getAvailableCredit(card: CreditCard): number {
    return card.limit - card.balance;
  }

  getUsagePercentage(card: CreditCard): number {
    return Math.round((card.balance / card.limit) * 100);
  }

  selectCard(card: CreditCard) {
    this.selectedCard = card;
  }

  // --- TRANSACCIÓN: CONGELAR TARJETA (DISPONIBLE ONLINE Y OFFLINE) ---
  async toggleFreezeCard() {
    this.selectedCard.isFrozen = !this.selectedCard.isFrozen;

    let msg = '';
    if (this.selectedCard.isFrozen) {
      msg = this.isOnline 
        ? `La tarjeta ${this.selectedCard.cardName} fue congelada temporalmente.`
        : `La tarjeta ${this.selectedCard.cardName} se congeló localmente. Se sincronizará al recuperar conexión.`;
    } else {
      msg = this.isOnline 
        ? `La tarjeta ${this.selectedCard.cardName} está activa nuevamente.`
        : `La tarjeta ${this.selectedCard.cardName} se descongeló localmente. Se sincronizará al recuperar conexión.`;
    }

    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 3000,
      position: 'bottom',
      color: this.selectedCard.isFrozen ? 'warning' : 'success'
    });
    await toast.present();
  }

  async openStatementModal() {
    try {
      const modal = await this.modalCtrl.create({
        component: StatementModalComponent,
        componentProps: {
          card: { ...this.selectedCard }
        }
      });
      await modal.present();
    } catch (error) {
      console.error('Error al abrir el estado de cuenta:', error);
    }
  }

  // --- TRANSACCIÓN CRÍTICA: TRANSFERIR (SOLO ONLINE) ---
  async openTransferModal() {
    if (!this.isOnline) {
      const toast = await this.toastCtrl.create({
        message: 'Esta función requiere conexión a internet para procesar la transacción de forma segura.',
        duration: 3500,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    try {
      const modal = await this.modalCtrl.create({
        component: TransferModalComponent,
        componentProps: {
          sourceCard: this.selectedCard,
          allCards: this.cards
        }
      });

      await modal.present();

      const { data, role } = await modal.onDidDismiss();
      const resData = data as any;

      if (role === 'confirm' && resData) {
        const transferAmount = Number(resData.amount) || 0;
        const targetCard = this.cards.find(c => c.id === resData.targetCardId);

        if (targetCard) {
          this.selectedCard.balance += transferAmount;
          targetCard.balance = Math.max(0, targetCard.balance - transferAmount);

          this.transactions.unshift({
            id: Date.now(),
            title: `Transferencia a ${targetCard.cardName}`,
            category: 'Transferencia',
            amount: transferAmount,
            date: 'Hoy',
            type: 'expense',
            icon: 'swap-horizontal-outline',
            cardId: this.selectedCard.id,
            period: 'month'
          });

          this.transactions.unshift({
            id: Date.now() + 1,
            title: `Abono desde ${this.selectedCard.cardName}`,
            category: 'Transferencia',
            amount: transferAmount,
            date: 'Hoy',
            type: 'income',
            icon: 'swap-horizontal-outline',
            cardId: targetCard.id,
            period: 'month'
          });

          const toast = await this.toastCtrl.create({
            message: `¡Transferencia de $${transferAmount.toFixed(2)} realizada con éxito!`,
            duration: 3000,
            color: 'success',
            position: 'bottom'
          });
          await toast.present();
        }
      }
    } catch (error) {
      console.error('Error al abrir el modal de transferencia:', error);
    }
  }

  // --- TRANSACCIÓN CRÍTICA: PAGAR (SOLO ONLINE) ---
  async makePayment() {
    if (!this.isOnline) {
      const toast = await this.toastCtrl.create({
        message: 'Esta función requiere conexión a internet para procesar la transacción de forma segura.',
        duration: 3500,
        position: 'bottom',
        color: 'warning'
      });
      await toast.present();
      return;
    }

    try {
      const modal = await this.modalCtrl.create({
        component: PayModalComponent,
        componentProps: {
          card: { ...this.selectedCard }
        }
      });

      await modal.present();

      const { data, role } = await modal.onDidDismiss();
      const resData = data as any;

      if (role === 'confirm' && resData) {
        const paidAmount = Number(resData.amount) || 0;
        
        const targetCard = this.cards.find(c => c.id === (resData.cardId || this.selectedCard.id));
        if (targetCard) {
          targetCard.balance = Math.max(0, targetCard.balance - paidAmount);
          this.selectedCard = targetCard;
        }

        this.transactions.unshift({
          id: Date.now(),
          title: `Pago - ${this.selectedCard.cardName}`,
          category: 'Abono',
          amount: paidAmount,
          date: 'Hoy',
          type: 'income',
          icon: 'wallet-outline',
          cardId: this.selectedCard.id,
          period: 'month'
        });

        const toast = await this.toastCtrl.create({
          message: `¡Pago de $${paidAmount.toFixed(2)} realizado con éxito!`,
          duration: 3000,
          color: 'success',
          position: 'bottom'
        });
        await toast.present();
      }
    } catch (error) {
      console.error('Error al abrir el modal:', error);
    }
  }

  // --- GESTOS ---
  async handleRefresh(event: any) {
    setTimeout(async () => {
      this.loadUserData();
      event.target.complete();

      const toast = await this.toastCtrl.create({
        message: 'Saldos y movimientos actualizados.',
        duration: 1500,
        position: 'bottom',
        color: 'dark'
      });
      await toast.present();
    }, 1200);
  }

  async verRecibo(tx: Transaction) {
    const toast = await this.toastCtrl.create({
      message: `Comprobante: ${tx.title} - $${tx.amount.toFixed(2)} (${tx.category})`,
      duration: 2500,
      position: 'bottom',
      color: 'dark'
    });
    await toast.present();
  }

  async reportarMovimiento(tx: Transaction) {
    this.transactions = this.transactions.filter(t => t.id !== tx.id);

    const toast = await this.toastCtrl.create({
      message: `Se ha enviado el reporte para "${tx.title}".`,
      duration: 2000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}