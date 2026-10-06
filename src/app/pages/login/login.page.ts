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


interface UserAccount {
  fullName: string;
  username: string;
  email: string;
  password: string;
  phone: string;
  associatedBank: string;
}


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

  // =========================================================
  // CLAVES DE ALMACENAMIENTO
  // =========================================================

  private readonly USERS_KEY = 'creditmonitor_users';

  private readonly CURRENT_USER_KEY = 'creditmonitor_current_user';


  // =========================================================
  // ESTADO DE LA PANTALLA
  // =========================================================

  currentView: string = 'login';

  showPassword: boolean = false;

  loginError: string = '';

  registerError: string = '';


  // =========================================================
  // DATOS DEL LOGIN
  // =========================================================

  loginData = {
    username: '',
    password: ''
  };


  // =========================================================
  // DATOS DEL REGISTRO
  // =========================================================

  registerData = {
    fullName: '',
    email: '',
    password: ''
  };


  forgotEmail: string = '';


  // =========================================================
  // CONSTRUCTOR
  // =========================================================

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

  this.crearUsuarioInicial();
}

  // =========================================================
  // CAMBIAR DE VISTA
  // =========================================================

  setView(view: string) {

    this.currentView = view;

    this.loginError = '';

    this.registerError = '';

    this.showPassword = false;
  }


  // =========================================================
  // MOSTRAR / OCULTAR CONTRASEÑA
  // =========================================================

  togglePassword() {

    this.showPassword = !this.showPassword;
  }


  // =========================================================
  // CREAR USUARIO INICIAL
  // =========================================================

  private crearUsuarioInicial() {

    const users = this.obtenerUsuarios();

    const usuarioExiste = users.some(
      user =>
        user.username.toLowerCase() === 'chrismarlyn'
    );

    if (usuarioExiste) {
      return;
    }

    const usuarioInicial: UserAccount = {

      fullName: 'Chrismarlyn Taveras',

      username: 'chrismarlyn',

      email: 'chrismarlyn@creditmonitor.com',

      password: '123456',

      phone: '809-555-0199',

      associatedBank: 'Banco Popular'
    };

    users.push(usuarioInicial);

    localStorage.setItem(
      this.USERS_KEY,
      JSON.stringify(users)
    );

    console.log(
      'Usuario inicial creado correctamente.'
    );
  }


  // =========================================================
  // OBTENER USUARIOS
  // =========================================================

  private obtenerUsuarios(): UserAccount[] {

    const data = localStorage.getItem(
      this.USERS_KEY
    );

    if (!data) {
      return [];
    }

    try {

      const users = JSON.parse(data);

      if (Array.isArray(users)) {
        return users;
      }

      return [];

    } catch (error) {

      console.error(
        'Error leyendo usuarios:',
        error
      );

      return [];
    }
  }


  // =========================================================
  // GUARDAR USUARIOS
  // =========================================================

  private guardarUsuarios(
    users: UserAccount[]
  ) {

    localStorage.setItem(
      this.USERS_KEY,
      JSON.stringify(users)
    );
  }


  // =========================================================
  // INICIAR SESIÓN
  // =========================================================

  // =========================================================
// INICIAR SESIÓN
// =========================================================

onLogin() {

  this.loginError = '';

  const username =
    this.loginData.username
      .trim()
      .toLowerCase();

  const password =
    this.loginData.password;


  // Validar campos vacíos
  if (!username || !password) {

    this.loginError =
      'Por favor completa usuario y contraseña.';

    alert(
      'Por favor completa usuario y contraseña.'
    );

    return;
  }


  // Obtener usuarios registrados
  const users =
    this.obtenerUsuarios();


  // Buscar coincidencia por usuario o correo
  const user =
    users.find(
      account =>

        (
          account.username
            .toLowerCase() === username

          ||

          account.email
            .toLowerCase() === username

        )

        &&

        account.password === password
    );


  // ========================================================
  // CREDENCIALES INCORRECTAS
  // ========================================================

  if (!user) {

    this.loginError =
      'Usuario o contraseña incorrectos.';


    // Limpiar contraseña
    this.loginData.password = '';


    // Mostrar aviso al usuario
    alert(
      'Usuario o contraseña incorrectos.'
    );


    console.log(
      'Intento de inicio de sesión rechazado.'
    );


    return;
  }


  // ========================================================
  // LOGIN CORRECTO
  // ========================================================

  localStorage.setItem(
    this.CURRENT_USER_KEY,
    JSON.stringify(user)
  );


  console.log(
    'Inicio de sesión correcto:',
    user.username
  );


  // Limpiar formulario
  this.loginData.username = '';

  this.loginData.password = '';


  // Entrar al Dashboard
  this.router.navigate(
    ['/tabs/tab1']
  );

}

  // =========================================================
  // REGISTRAR USUARIO
  // =========================================================

  onRegister() {

    this.registerError = '';

    const fullName =
      this.registerData.fullName.trim();

    const email =
      this.registerData.email
        .trim()
        .toLowerCase();

    const password =
      this.registerData.password;

    // Validar campos
    if (!fullName || !email || !password) {

      this.registerError =
        'Completa todos los campos para registrarte.';

      return;
    }

    // Validar contraseña
    if (password.length < 6) {

      this.registerError =
        'La contraseña debe tener al menos 6 caracteres.';

      return;
    }

    // Validar correo
    if (!email.includes('@')) {

      this.registerError =
        'Ingresa un correo electrónico válido.';

      return;
    }

    const users = this.obtenerUsuarios();

    // Verificar correo existente
    const emailExiste = users.some(
      user =>
        user.email.toLowerCase() === email
    );

    if (emailExiste) {

      this.registerError =
        'Este correo ya está registrado.';

      return;
    }

    // Crear usuario a partir del correo
    const username =
      email
        .split('@')[0]
        .toLowerCase();

    // Verificar usuario
    const usernameExiste = users.some(
      user =>
        user.username.toLowerCase() === username
    );

    if (usernameExiste) {

      this.registerError =
        'El usuario generado ya existe. Usa otro correo.';

      return;
    }

    const nuevoUsuario: UserAccount = {

      fullName,

      username,

      email,

      password,

      phone: '',

      associatedBank: 'Banco Popular'
    };

    users.push(nuevoUsuario);

    this.guardarUsuarios(users);

    alert(
      `¡Cuenta registrada con éxito!\n\nUsuario: ${username}`
    );

    // Limpiar registro
    this.registerData = {
      fullName: '',
      email: '',
      password: ''
    };

    // Regresar al login
    this.setView('login');

    // Colocar usuario automáticamente
    this.loginData.username = username;
  }


  // =========================================================
  // RECUPERAR CONTRASEÑA
  // =========================================================

  onForgot() {

    const email =
      this.forgotEmail
        .trim()
        .toLowerCase();

    if (!email) {

      alert(
        'Ingresa tu correo electrónico.'
      );

      return;
    }

    const users = this.obtenerUsuarios();

    const user = users.find(
      account =>
        account.email.toLowerCase() === email
    );

    if (!user) {

      alert(
        'No existe una cuenta registrada con ese correo.'
      );

      return;
    }

    alert(
      'Solicitud recibida. En un sistema real, aquí se enviaría un enlace de recuperación al correo.'
    );

    this.forgotEmail = '';

    this.setView('login');
  }


  // =========================================================
  // VOLVER A WELCOME
  // =========================================================

  goBackToWelcome() {

    this.router.navigate(
      ['/welcome']
    );
  }

}