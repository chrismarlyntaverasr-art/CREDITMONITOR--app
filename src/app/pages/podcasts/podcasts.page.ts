
import { Component, inject } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonIcon,
  IonRange,
  IonListHeader,
    IonButtons,
  IonBackButton,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { play, pause, stop, musicalNotes } from 'ionicons/icons';
import { AudioPlayerService, Podcast } from '../../services/audio-player.service';

@Component({
  selector: 'app-podcasts',
  templateUrl: './podcasts.page.html',
  styleUrls: ['./podcasts.page.scss'],
  standalone: true,
  imports: [
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonButton,
    IonIcon,
    IonRange,
    IonListHeader,
        IonButtons,
    IonBackButton,
  ],
})
export class PodcastsPage {
  player = inject(AudioPlayerService);

  podcasts: Podcast[] = [
    {
      id: 1,
      title: 'Cápsulas de Educación Financiera: ¿Por qué es importante manejar nuestras finanzas?',
      author: 'Podcast Educativo',
      description: 'Conceptos básicos para crear apps híbridas.',
     url: 'assets/audio/credit-protection.mp3',
    },
    {
      id: 2,
      title: 'Capacitor y plugins nativos',
      author: 'Podcast Educativo',
      description: 'Cómo acceder a funciones del dispositivo.',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    },
    {
      id: 3,
      title: 'Buenas prácticas de estudio',
      author: 'Podcast Educativo',
      description: 'Técnicas para mejorar tu rendimiento académico.',
      url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    },
  ];

  constructor() {
    addIcons({ play, pause, stop, musicalNotes });
  }


  // Se ejecuta al salir de la página (flecha atrás o cualquier navegación)
  ionViewWillLeave() {
    this.player.stop();
  }

  isCurrent(p: Podcast) {
    return this.player.current()?.id === p.id;
  }


  isPlayingNow(p: Podcast) {
    return this.isCurrent(p) && this.player.isPlaying();
  }

  onSeek(ev: Event) {
    const value = (ev as CustomEvent).detail.value as number;
    this.player.seek(value);
  }

  fmt(seconds: number) {
    return AudioPlayerService.format(seconds);
  }
}