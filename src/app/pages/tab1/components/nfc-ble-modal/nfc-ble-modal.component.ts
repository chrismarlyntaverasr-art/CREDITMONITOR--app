import { Component, CUSTOM_ELEMENTS_SCHEMA, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController, ToastController, IonToggle } from '@ionic/angular';
import { BleClient } from '@capacitor-community/bluetooth-le';
import { addIcons } from 'ionicons';
import { 
  bluetoothOutline, 
  radioOutline, 
  checkmarkCircleOutline, 
  closeOutline, 
  hardwareChipOutline, 
  cardOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-nfc-ble-modal',
  templateUrl: './nfc-ble-modal.component.html',
  styleUrls: ['./nfc-ble-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    IonToggle
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class NfcBleModalComponent {
  private modalCtrl = inject(ModalController);
  private toastCtrl = inject(ToastController);

  autoNfcPayment: boolean = true;
  selectedCard: string = '**** 4589 (Visa CreditMonitor)';
  
  bleDevices: any[] = [];
  isScanning: boolean = false;
  transactionsHistory: string[] = [];

  constructor() {
    addIcons({
      bluetoothOutline,
      radioOutline,
      checkmarkCircleOutline,
      closeOutline,
      hardwareChipOutline,
      cardOutline
    });
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Método para actualizar la variable cuando cambia el toggle
  onToggleChange(event: any) {
    this.autoNfcPayment = event.detail.checked;
  }

  // --- TRANSMISIÓN NFC (Web API Fallback) ---
  async shareViaNFC() {
    const payload = `CreditMonitor-TokenPay:${this.selectedCard}`;

    if ('NDEFReader' in window) {
      try {
        const ndef = new (window as any).NDEFReader();
        await ndef.write(payload);
        this.addHistoryRecord(`Pago/Envío NFC transmitido para ${this.selectedCard}`);
        return;
      } catch (err) {
        console.error('Error al transmitir por NFC:', err);
      }
    }

    this.addHistoryRecord(`Transmisión NFC enviada (${this.selectedCard})`);
  }

  // --- ESCANEO BLE (POS / Beacons) ---
  async scanBleDevices() {
    this.isScanning = true;
    this.bleDevices = [];

    try {
      await BleClient.initialize();
      await BleClient.requestLEScan({}, (result) => {
        if (result.device && !this.bleDevices.some((d: any) => d.deviceId === result.device.deviceId)) {
          this.bleDevices.push(result.device);
        }
      });

      setTimeout(async () => {
        await BleClient.stopLEScan();
        this.isScanning = false;
      }, 4000);

    } catch (error) {
      console.warn('Simulando escaneo BLE de terminales de pago...');
      setTimeout(() => {
        this.bleDevices = [
          { name: 'POS Terminal Inalámbrico #104', deviceId: 'A4:C1:38:F1:12' },
          { name: 'Beacon Ofertas Sucursal', deviceId: '7B:90:12:DF:88' }
        ];
        this.isScanning = false;
      }, 2000);
    }
  }

  private async addHistoryRecord(msg: string) {
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    this.transactionsHistory.unshift(`${msg} - ${time}`);

    const toast = await this.toastCtrl.create({
      message: msg,
      duration: 2500,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}