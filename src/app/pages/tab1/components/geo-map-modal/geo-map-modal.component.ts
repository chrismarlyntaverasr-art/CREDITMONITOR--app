
import {
  Component,
  AfterViewInit,
  OnDestroy,
  inject,
  CUSTOM_ELEMENTS_SCHEMA
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { ModalController, AlertController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, locateOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-geo-map-modal',
  templateUrl: './geo-map-modal.component.html',
  styleUrls: ['./geo-map-modal.component.scss'],
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GeoMapModalComponent
  implements AfterViewInit, OnDestroy {

  private modalCtrl = inject(ModalController);
  private alertCtrl = inject(AlertController);

  private map?: L.Map;
  private userMarker?: L.Marker;

  private sucursales = [
    {
      nombre: 'Sucursal Principal',
      lat: 18.4861,
      lng: -69.9312
    },
    {
      nombre: 'Sucursal Zona Metro',
      lat: 18.4712,
      lng: -69.9150
    },
    {
      nombre: 'Sucursal Financiera Este',
      lat: 18.4920,
      lng: -69.8800
    }
  ];

  constructor() {
    addIcons({
      closeOutline,
      locateOutline
    });
  }

  ngAfterViewInit(): void {
    // Esperar a que Ionic termine de dibujar el modal.
    setTimeout(() => {
      this.initMap();
    }, 300);
  }

  private initMap(): void {
    const container = document.getElementById('map');

    if (!container || this.map) {
      return;
    }

    this.map = L.map(container).setView(
      [18.4861, -69.9312],
      13
    );

    L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19
      }
    ).addTo(this.map);

    // Cargar los iconos desde los recursos locales de la aplicación.
    const defaultIcon = L.icon({
      iconUrl: 'assets/leaflet/marker-icon.png',
      iconRetinaUrl: 'assets/leaflet/marker-icon-2x.png',
      shadowUrl: 'assets/leaflet/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });

    L.Marker.prototype.options.icon = defaultIcon;

    // Mostrar las sucursales.
    this.sucursales.forEach(sucursal => {
      L.marker([
        sucursal.lat,
        sucursal.lng
      ])
        .addTo(this.map!)
        .bindPopup(
          `<b>${sucursal.nombre}</b><br>
           Punto de atención CreditMonitor`
        );
    });

    // Corregir las dimensiones después de mostrar el modal.
    requestAnimationFrame(() => {
      this.map?.invalidateSize();
    });

    // Intentar localizar al usuario.
    void this.obtenerUbicacionGPS();
  }

  async obtenerUbicacionGPS(): Promise<void> {
    if (!this.map) {
      return;
    }

    try {
      const coordinates =
        await Geolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 5000
        });

      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      this.map.setView([lat, lng], 15);

      if (this.userMarker) {
        this.userMarker.remove();
      }

      this.userMarker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup(
          '<b>¡Estás aquí!</b><br>Ubicación GPS actual'
        )
        .openPopup();

      this.map.invalidateSize();

    } catch (error) {
      console.error(
        'Error obteniendo la geolocalización:',
        error
      );

      const alert = await this.alertCtrl.create({
        header: 'Ubicación no disponible',
        message:
          'No se pudo obtener tu ubicación. Verifica que el GPS esté activado y que CreditMonitor tenga permiso para acceder a la ubicación.',
        buttons: ['Aceptar']
      });

      await alert.present();
    }
  }

  dismiss(): void {
    this.modalCtrl.dismiss();
  }

  ngOnDestroy(): void {
    this.map?.remove();
    this.map = undefined;
  }
}
