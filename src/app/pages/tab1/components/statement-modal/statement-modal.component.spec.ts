import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StatementModalComponent } from './statement-modal.component';

describe('StatementModalComponent', () => {
  let component: StatementModalComponent;
  let fixture: ComponentFixture<StatementModalComponent>;

  beforeEach(() => {
    fixture = TestBed.createComponent(StatementModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
