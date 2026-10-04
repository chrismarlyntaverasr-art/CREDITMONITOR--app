import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, IonSelect, IonSelectOption, ToastController } from '@ionic/angular';
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
  walletOutline,
} from 'ionicons/icons';

import { Deuda, DeudasStorageService, NuevaDeuda, TipoDeuda } from '../services/deudas-storage.service';

interface FormularioDeuda {
  banco: string;
  tipo: TipoDeuda;
  descripcion: string;
  monto: number | null;
  cuotaMensual: number | null;
  ultimos4: string;
}

@Component({
  selector: 'app-tab2',
  templateUrl: './tab2.page.html',
  styleUrls: ['./tab2.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonSelect, IonSelectOption],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class Tab2Page implements OnInit {
  private readonly storage = inject(DeudasStorageService);
  private readonly toastCtrl = inject(ToastController);
  private readonly alertCtrl = inject(AlertController);

  deudas: Deuda[] = [];
  mostrarFormulario = false;
  editandoId: string | null = null;
  cargando = true;

  formulario: FormularioDeuda = this.formularioVacio();

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
      walletOutline,
    });
  }

  async ngOnInit(): Promise<void> {
    await this.storage.inicializarDatosDemo();
    await this.cargarDeudas();
  }

  async ionViewWillEnter(): Promise<void> {
    await this.cargarDeudas();
  }

  async cargarDeudas(): Promise<void> {
    this.cargando = true;
    this.deudas = await this.storage.obtenerTodas();
    this.cargando = false;
  }

  get totalDeuda(): number {
    return this.deudas.reduce((total, deuda) => total + Number(deuda.monto || 0), 0);
  }

  get totalCuotasMensuales(): number {
    return this.deudas.reduce(
      (total, deuda) => total + Number(deuda.cuotaMensual || 0),
      0,
    );
  }

  nuevaDeuda(): void {
    this.editandoId = null;
    this.formulario = this.formularioVacio();
    this.mostrarFormulario = true;
  }

  editar(deuda: Deuda): void {
    this.editandoId = deuda.id;
    this.formulario = {
      banco: deuda.banco,
      tipo: deuda.tipo,
      descripcion: deuda.descripcion,
      monto: deuda.monto,
      cuotaMensual: deuda.cuotaMensual,
      ultimos4: deuda.ultimos4 ?? '',
    };
    this.mostrarFormulario = true;
  }

  cancelarEdicion(): void {
    this.editandoId = null;
    this.formulario = this.formularioVacio();
    this.mostrarFormulario = false;
  }

  async guardar(): Promise<void> {
    const banco = this.formulario.banco.trim();
    const descripcion = this.formulario.descripcion.trim();
    const monto = Number(this.formulario.monto ?? 0);
    const cuotaMensual = Number(this.formulario.cuotaMensual ?? 0);

    if (!banco || !descripcion || monto <= 0) {
      await this.mostrarToast('Completa banco, descripción y un monto mayor que cero.', 'warning');
      return;
    }

    const datos: NuevaDeuda = {
      banco,
      tipo: this.formulario.tipo,
      descripcion,
      monto,
      cuotaMensual: Math.max(0, cuotaMensual),
      ultimos4:
        this.formulario.tipo === 'Tarjeta'
          ? this.formulario.ultimos4.trim().slice(-4)
          : '',
    };

    if (this.editandoId) {
      await this.storage.actualizar(this.editandoId, datos);
      await this.mostrarToast('Deuda actualizada y guardada en el dispositivo.', 'success');
    } else {
      await this.storage.crear(datos);
      await this.mostrarToast('Deuda creada y guardada en el dispositivo.', 'success');
    }

    this.cancelarEdicion();
    await this.cargarDeudas();
  }

  async confirmarEliminar(deuda: Deuda): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Eliminar deuda',
      message: `¿Deseas eliminar “${deuda.descripcion}” de ${deuda.banco}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            void this.eliminar(deuda.id);
          },
        },
      ],
    });

    await alert.present();
  }

  async eliminar(id: string): Promise<void> {
    const eliminado = await this.storage.eliminar(id);

    if (eliminado) {
      await this.cargarDeudas();
      await this.mostrarToast('Deuda eliminada correctamente.', 'success');
    }
  }

  async refrescar(event: any): Promise<void> {
    await this.cargarDeudas();
    event?.target?.complete?.();
  }

  private formularioVacio(): FormularioDeuda {
    return {
      banco: '',
      tipo: 'Prestamo',
      descripcion: '',
      monto: null,
      cuotaMensual: null,
      ultimos4: '',
    };
  }

  private async mostrarToast(
    message: string,
    color: 'success' | 'warning' | 'danger' = 'success',
  ): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2200,
      color,
      position: 'bottom',
    });
    await toast.present();
  }
}
