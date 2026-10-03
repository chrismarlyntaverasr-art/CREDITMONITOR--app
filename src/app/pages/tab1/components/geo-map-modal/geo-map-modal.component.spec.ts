import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeoMapModalComponent } from './geo-map-modal.component';

describe('GeoMapModalComponent', () => {
  let component: GeoMapModalComponent;
  let fixture: ComponentFixture<GeoMapModalComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(GeoMapModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
