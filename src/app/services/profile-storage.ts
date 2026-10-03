import { Injectable, inject } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

export interface UserProfile {
  name: string;
  career: string;
  email: string;
  shareNfcAuto: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileStorageService {
  private ionicStorage = inject(Storage);
  private _storage: Storage | null = null;

  constructor() {
    this.init();
  }

  async init() {
    const storage = await this.ionicStorage.create();
    this._storage = storage;
  }

  async setProfile(profile: UserProfile) {
    await this._storage?.set('user_profile', profile);
  }

  async getProfile(): Promise<UserProfile | null> {
    return await this._storage?.get('user_profile');
  }
}