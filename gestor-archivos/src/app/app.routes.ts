import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { GestorComponent } from './gestor/gestor';
import { authGuard } from './guard/auth.guard-guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { 
    path: 'gestor', 
    component: GestorComponent, 
    canActivate: [authGuard]
  },
  { path: '**', redirectTo: 'login' }
];