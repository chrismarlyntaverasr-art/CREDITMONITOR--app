import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { 
  closeOutline, 
  bookOutline, 
  helpCircleOutline, 
  analyticsOutline, 
  checkmarkCircleOutline, 
  shieldCheckmarkOutline, 
  refreshOutline 
} from 'ionicons/icons';

@Component({
  selector: 'app-centro-informacion',
  templateUrl: './centro-informacion.page.html',
  styleUrls: ['./centro-informacion.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CentroInformacionPage {
  private modalCtrl = inject(ModalController);

  activeSegment: string = 'articles';

  constructor() {
    addIcons({ 
      closeOutline, 
      bookOutline, 
      helpCircleOutline, 
      analyticsOutline, 
      checkmarkCircleOutline, 
      shieldCheckmarkOutline, 
      refreshOutline 
    });
  }

  closeModal() {
    this.modalCtrl.dismiss();
  }
}