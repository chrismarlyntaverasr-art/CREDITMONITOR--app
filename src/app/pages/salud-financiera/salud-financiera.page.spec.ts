import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SaludFinancieraPage } from './salud-financiera.page';

describe('SaludFinancieraPage', () => {
  let component: SaludFinancieraPage;
  let fixture: ComponentFixture<SaludFinancieraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SaludFinancieraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
