import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NfcBleModalComponent } from './nfc-ble-modal.component';

describe('NfcBleModalComponent', () => {
  let component: NfcBleModalComponent;
  let fixture: ComponentFixture<NfcBleModalComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NfcBleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
