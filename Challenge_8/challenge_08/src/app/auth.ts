import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Auth {
  usuario = signal<string | null>(null);

  estaLogueado() {
    return this.usuario() !== null;
  }

  entrar(email: string) {
    this.usuario.set(email);
  }

  salir() {
    this.usuario.set(null);
  }
}