import { Routes } from '@angular/router';
import { PerfilComponent } from './paginas/perfil/perfil';
import { MensajesComponent } from './paginas/mensajes/mensajes';
import { CuentaComponent } from './paginas/cuenta/cuenta';
import { SeguridadComponent } from './paginas/seguridad/seguridad';
import { ContrasenaComponent } from './paginas/contrasena/contrasena';
import { NotificacionComponent } from './paginas/notificacion/notificacion';
import { FaqsComponent } from './paginas/faqs/faqs';
import { TicketComponent } from './paginas/ticket/ticket';
import { NetworkComponent } from './paginas/network/network';

export const routes: Routes = [
  { path: '', redirectTo: 'profile', pathMatch: 'full' },
  { path: 'profile', component: PerfilComponent },
  { path: 'messages', component: MensajesComponent },
  { path: 'settings/account', component: CuentaComponent },
  { path: 'settings/security', component: SeguridadComponent },
  { path: 'settings/password', component: ContrasenaComponent },
  { path: 'settings/notification', component: NotificacionComponent },
  { path: 'help/faqs', component: FaqsComponent },
  { path: 'help/ticket', component: TicketComponent },
  { path: 'help/network', component: NetworkComponent },
];