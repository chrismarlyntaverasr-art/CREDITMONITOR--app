import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CentroInformacionPage } from './centro-informacion.page';

describe('CentroInformacionPage', () => {
  let component: CentroInformacionPage;
  let fixture: ComponentFixture<CentroInformacionPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CentroInformacionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
