import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export type TipoDeuda = 'Prestamo' | 'Tarjeta';

export interface Deuda {
  id: string;
  banco: string;
  tipo: TipoDeuda;
  descripcion: string;
  monto: number;
  cuotaMensual: number;
  ultimos4?: string;
  fechaCreacion: string;
  fechaActualizacion: string;
}

export type NuevaDeuda = Omit<Deuda, 'id' | 'fechaCreacion' | 'fechaActualizacion'>;

@Injectable({
  providedIn: 'root',
})
export class DeudasStorageService {
  private readonly STORAGE_KEY = 'creditmonitor_deudas_v1';
  private readonly storageReady: Promise<Storage>;

  constructor(private storage: Storage) {
    this.storageReady = this.storage.create();
  }

  private async db(): Promise<Storage> {
    return this.storageReady;
  }

  async inicializarDatosDemo(): Promise<void> {
    const db = await this.db();
    const existentes = await db.get(this.STORAGE_KEY);

    // Solo se cargan datos demo la primera vez.
    // Si el usuario elimina todo, no se vuelven a crear automáticamente.
    if (existentes !== null && existentes !== undefined) {
      return;
    }

    const ahora = new Date().toISOString();
    const demo: Deuda[] = [
      {
        id: 'demo-popular-1',
        banco: 'Banco Popular',
        tipo: 'Prestamo',
        descripcion: 'Préstamo Personal',
        monto: 85000,
        cuotaMensual: 3200,
        ultimos4: '',
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      },
      {
        id: 'demo-bhd-1',
        banco: 'Banco BHD',
        tipo: 'Tarjeta',
        descripcion: 'Mastercard Black BHD',
        monto: 23500,
        cuotaMensual: 0,
        ultimos4: '8902',
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      },
      {
        id: 'demo-banreservas-1',
        banco: 'Banreservas',
        tipo: 'Tarjeta',
        descripcion: 'Visa Clásica Banreservas',
        monto: 15400,
        cuotaMensual: 0,
        ultimos4: '1154',
        fechaCreacion: ahora,
        fechaActualizacion: ahora,
      },
    ];

    await db.set(this.STORAGE_KEY, demo);
  }

  // READ
  async obtenerTodas(): Promise<Deuda[]> {
    const db = await this.db();
    return (await db.get(this.STORAGE_KEY)) ?? [];
  }

  // READ por id
  async obtenerPorId(id: string): Promise<Deuda | undefined> {
    const deudas = await this.obtenerTodas();
    return deudas.find((deuda) => deuda.id === id);
  }

  // CREATE
  async crear(datos: NuevaDeuda): Promise<Deuda> {
    const db = await this.db();
    const deudas = await this.obtenerTodas();
    const ahora = new Date().toISOString();

    const nueva: Deuda = {
      ...datos,
      id: this.generarId(),
      fechaCreacion: ahora,
      fechaActualizacion: ahora,
    };

    await db.set(this.STORAGE_KEY, [nueva, ...deudas]);
    return nueva;
  }

  // UPDATE
  async actualizar(id: string, cambios: NuevaDeuda): Promise<Deuda | null> {
    const db = await this.db();
    const deudas = await this.obtenerTodas();
    const indice = deudas.findIndex((deuda) => deuda.id === id);

    if (indice === -1) {
      return null;
    }

    const actualizada: Deuda = {
      ...deudas[indice],
      ...cambios,
      id,
      fechaActualizacion: new Date().toISOString(),
    };

    deudas[indice] = actualizada;
    await db.set(this.STORAGE_KEY, deudas);
    return actualizada;
  }

  // DELETE
  async eliminar(id: string): Promise<boolean> {
    const db = await this.db();
    const deudas = await this.obtenerTodas();
    const filtradas = deudas.filter((deuda) => deuda.id !== id);

    if (filtradas.length === deudas.length) {
      return false;
    }

    await db.set(this.STORAGE_KEY, filtradas);
    return true;
  }

  async limpiarTodo(): Promise<void> {
    const db = await this.db();
    await db.set(this.STORAGE_KEY, []);
  }

  private generarId(): string {
    return `deuda-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
  }
}
