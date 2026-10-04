import { Injectable } from '@angular/core';
import { MenuNode } from '../menu-node/menu-node';

@Injectable({ providedIn: 'root' })
export class MenuTreeService {

  construirArbol(): MenuNode {
    const raiz = new MenuNode('Menú Principal');

    const profile = new MenuNode('Profile', '/profile', 'ProfileComponent');

    const messages = new MenuNode('Messages', '/messages', 'MessagesComponent');

    const settings = new MenuNode('Settings', '/settings', 'SettingsComponent');

    const account = new MenuNode('Account', '/settings/account', 'AccountComponent');
    const profileSub = new MenuNode('Profile', '/settings/profile', 'ProfileSettingsComponent');
    const security = new MenuNode('Security & Privacy', '/settings/security', 'SecurityComponent');
    const password = new MenuNode('Password', '/settings/password', 'PasswordComponent');
    const notification = new MenuNode('Notification', '/settings/notification', 'NotificationComponent');

    settings.agregarHijo(account);
    settings.agregarHijo(profileSub);
    settings.agregarHijo(security);
    settings.agregarHijo(password);
    settings.agregarHijo(notification);

    const help = new MenuNode('Help', '/help', 'HelpComponent');

    const faqs = new MenuNode('FAQ\'s', '/help/faqs', 'FaqsComponent');
    const ticket = new MenuNode('Submit a Ticket', '/help/ticket', 'TicketComponent');
    const network = new MenuNode('Network Status', '/help/network', 'NetworkComponent');

    help.agregarHijo(faqs);
    help.agregarHijo(ticket);
    help.agregarHijo(network);

    const logout = new MenuNode('Logout', '/logout', 'LogoutComponent');

    raiz.agregarHijo(profile);
    raiz.agregarHijo(messages);
    raiz.agregarHijo(settings);
    raiz.agregarHijo(help);
    raiz.agregarHijo(logout);

    return raiz;
  }

  dfs(nodo: MenuNode): void {
    console.log(nodo.titulo);
    for (const hijo of nodo.hijos) {
      this.dfs(hijo);
    }
  }

  bfs(raiz: MenuNode): void {
    const cola: MenuNode[] = [raiz];
    while (cola.length > 0) {
      const actual = cola.shift()!;
      console.log(actual.titulo);
      cola.push(...actual.hijos);
    }
  }
}