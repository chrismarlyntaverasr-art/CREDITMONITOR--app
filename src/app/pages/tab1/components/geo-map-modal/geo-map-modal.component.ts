import { Component, AfterViewInit, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { closeOutline, locateOutline } from 'ionicons/icons';
import { Geolocation } from '@capacitor/geolocation';
import * as L from 'leaflet';

@Component({
  selector: 'app-geo-map-modal',
  templateUrl: './geo-map-modal.component.html',
  styleUrls: ['./geo-map-modal.component.scss'],
  standalone: true,
  imports: [
    CommonModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class GeoMapModalComponent implements AfterViewInit {
  private modalCtrl = inject(ModalController);

  private map!: L.Map;
  private userMarker!: L.Marker;

  private sucursales = [
    { nombre: 'Sucursal Principal', lat: 18.4861, lng: -69.9312 },
    { nombre: 'Sucursal Zona Metro', lat: 18.4712, lng: -69.9150 },
    { nombre: 'Sucursal Financiera Este', lat: 18.4920, lng: -69.8800 }
  ];

  constructor() {
    addIcons({ closeOutline, locateOutline });
  }

  ngAfterViewInit() {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map').setView([18.4861, -69.9312], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    const defaultIcon = L.icon({
      iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
      shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34]
    });
    L.Marker.prototype.options.icon = defaultIcon;

    this.sucursales.forEach(suc => {
      L.marker([suc.lat, suc.lng])
        .addTo(this.map)
        .bindPopup(`<b>${suc.nombre}</b><br>Punto de atención CreditMonitor`);
    });

    this.obtenerUbicacionGPS();
  }

  async obtenerUbicacionGPS() {
    try {
      const coordinates = await Geolocation.getCurrentPosition();
      const lat = coordinates.coords.latitude;
      const lng = coordinates.coords.longitude;

      this.map.setView([lat, lng], 15);

      if (this.userMarker) {
        this.map.removeLayer(this.userMarker);
      }

      this.userMarker = L.marker([lat, lng])
        .addTo(this.map)
        .bindPopup('<b>¡Estás aquí!</b><br>Ubicación GPS actual')
        .openPopup();

    } catch (error) {
      console.error('Error obteniendo la geolocalización:', error);
    }
  }

  dismiss() {
    this.modalCtrl.dismiss();
  }
}