import { Injectable, signal } from '@angular/core';

export interface Podcast {
  id: number;
  title: string;
  author: string;
  description: string;
  url: string;
}

@Injectable({ providedIn: 'root' })
export class AudioPlayerService {
  private audio = new Audio();

  readonly current = signal<Podcast | null>(null);
  readonly isPlaying = signal(false);
  readonly currentTime = signal(0);
  readonly duration = signal(0);

  constructor() {
    this.audio.preload = 'metadata';

    this.audio.addEventListener('loadedmetadata', () => {
      this.duration.set(this.audio.duration || 0);
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime.set(this.audio.currentTime);
    });
    this.audio.addEventListener('play', () => this.isPlaying.set(true));
    this.audio.addEventListener('pause', () => this.isPlaying.set(false));
    this.audio.addEventListener('ended', () => {
      this.isPlaying.set(false);
      this.currentTime.set(0);
    });
    this.audio.addEventListener('error', () => {
      this.isPlaying.set(false);
      console.error('No se pudo reproducir el audio:', this.audio.src);
    });
  }

  async play(podcast: Podcast) {
    if (this.current()?.id !== podcast.id) {
      this.audio.src = podcast.url;
      this.current.set(podcast);
      this.currentTime.set(0);
      this.duration.set(0);
    }
    await this.audio.play();
  }

  async toggle(podcast?: Podcast) {
    if (podcast && this.current()?.id !== podcast.id) {
      return this.play(podcast);
    }
    if (this.audio.paused) {
      await this.audio.play();
    } else {
      this.audio.pause();
    }
  }

  pause() {
    this.audio.pause();
  }

  stop() {
    this.audio.pause();
    this.audio.currentTime = 0;
    this.currentTime.set(0);
  }

  seek(seconds: number) {
    this.audio.currentTime = seconds;
    this.currentTime.set(seconds);
  }

  static format(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) seconds = 0;
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  }
}