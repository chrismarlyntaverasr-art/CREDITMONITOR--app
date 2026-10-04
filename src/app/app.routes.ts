import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'welcome',
    pathMatch: 'full',
  },
  {
    path: 'welcome',
    loadComponent: () =>
      import('./pages/welcome/welcome.page').then((m) => m.WelcomePage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'tabs',
    loadChildren: () =>
      import('./tabs/tabs.routes').then((m) => m.routes),
  },
    {
  path: 'camara',
  loadComponent: () =>
    import('./pages/camara/camara.page').then((m) => m.CamaraPage),
  },
  {
    path: '**',
    redirectTo: 'welcome',
  },
  {
    path: 'centro-informacion',
    loadComponent: () => import('./pages/centro-informacion/centro-informacion.page').then( m => m.CentroInformacionPage)
  },
  {
    path: 'simulador-credito',
    loadComponent: () => import('./pages/simulador-credito/simulador-credito.page').then( m => m.SimuladorCreditoPage)
  },
  {
    path: 'salud-financiera',
    loadComponent: () => import('./pages/salud-financiera/salud-financiera.page').then( m => m.SaludFinancieraPage)
  },
  {
    path: 'camara',
    loadComponent: () => import('./pages/camara/camara.page').then( m => m.CamaraPage)
  },
];