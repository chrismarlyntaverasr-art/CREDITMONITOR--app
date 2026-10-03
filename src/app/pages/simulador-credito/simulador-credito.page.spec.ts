import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SimuladorCreditoPage } from './simulador-credito.page';

describe('SimuladorCreditoPage', () => {
  let component: SimuladorCreditoPage;
  let fixture: ComponentFixture<SimuladorCreditoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SimuladorCreditoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
