import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Pagina1 } from './private/pagina1/pagina1';
import { Pagina2 } from './private/pagina2/pagina2';
import { NoEncontrado } from './no-encontrado/no-encontrado';
import { authGuard } from './auth-guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  {
    path: 'private',
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'page1', pathMatch: 'full' },
      { path: 'page1', component: Pagina1 },
      { path: 'page2', component: Pagina2 }
    ]
  },
  { path: '**', component: NoEncontrado }
];