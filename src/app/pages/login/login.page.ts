import { Component, inject, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { 
  arrowBackOutline, 
  personOutline, 
  lockClosedOutline, 
  eyeOutline, 
  eyeOffOutline,
  mailOutline,
  shieldCheckmarkSharp 
} from 'ionicons/icons';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class LoginPage {
  private router = inject(Router);

  currentView: string = 'login';
  showPassword: boolean = false;

  loginData = { username: '', password: '' };
  registerData = { fullName: '', email: '', password: '' };
  forgotEmail: string = '';

  constructor() {
    addIcons({
      arrowBackOutline,
      personOutline,
      lockClosedOutline,
      eyeOutline,
      eyeOffOutline,
      mailOutline,
      shieldCheckmarkSharp
    });
  }

  setView(view: string) {
    this.currentView = view;
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onLogin() {
    // Redirección directa al Dashboard principal
    this.router.navigate(['/tabs/tab1']);
  }

  onRegister() {
    alert('¡Cuenta registrada con éxito!');
    this.setView('login');
  }

  onForgot() {
    alert('Instrucciones enviadas a tu correo.');
    this.setView('login');
  }

  goBackToWelcome() {
    this.router.navigate(['/welcome']);
  }
}