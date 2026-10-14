import { Component, effect, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgTemplateOutlet } from '@angular/common';
import { Router } from '@angular/router';
import { ArbolService } from '../services/arbol.service';
import { AuthService } from '../services/auth.service';
import { Nodo } from '../models/nodo/nodo';

@Component({
  selector: 'app-gestor',
  standalone: true,
  imports: [FormsModule, NgTemplateOutlet],
  templateUrl: './gestor.html',
  styleUrl: './gestor.scss'
})
export class GestorComponent {
  arbolService = inject(ArbolService);
  authService = inject(AuthService);
  private router = inject(Router);

  nuevoNombre = '';
  nuevoTipo: 'carpeta' | 'archivo' = 'carpeta';
  padreSeleccionadoId = '';

  constructor() {
    effect(() => {
      const user = this.authService.usuario();
      console.log('🔥 EFFECT: usuario =', user?.email ?? 'null');
      if (user) {
        this.arbolService.cargarArbol(user.email!).then(() => {
          console.log('🌳 Árbol cargado. raiz() =', this.arbolService.raiz());
        });
      }
    });
  }

  obtenerCarpetas(): Nodo[] {
    const carpetas: Nodo[] = [];
    const recorrer = (nodo: Nodo) => {
      if (nodo.tipo === 'carpeta') carpetas.push(nodo);
      nodo.hijos.forEach(recorrer);
    };
    if (this.arbolService.raiz()) recorrer(this.arbolService.raiz()!);
    return carpetas;
  }

  async crearElemento() {
    const user = this.authService.usuario();
    if (!this.nuevoNombre || !user) {
      console.log('❌ Faltan datos');
      return;
    }

    // 👇 GARANTIZAR que la raíz existe ANTES de continuar
    if (!this.arbolService.raiz()) {
      console.log('⚠️ No hay raíz. Cargando árbol...');
      await this.arbolService.cargarArbol(user.email!);
    }

    // 👇 Si después de cargar sigue null, creamos una localmente
    if (!this.arbolService.raiz()) {
      console.log('🆕 Creando raíz localmente');
      this.arbolService.raiz.set(new Nodo('Raíz', 'carpeta', user.email!));
    }

    const nuevoNodo = new Nodo(this.nuevoNombre, this.nuevoTipo, user.email!);

    let padre = this.arbolService.raiz()!;
    if (this.padreSeleccionadoId) {
      const encontrado = this.arbolService.buscarNodo(this.padreSeleccionadoId);
      if (encontrado) padre = encontrado;
    }

    try {
      padre.agregarHijo(nuevoNodo);
      console.log('✅ Hijo agregado. Guardando en Firestore...');
      await this.arbolService.guardarArbol(user.email!);
      console.log('✅ Árbol guardado');
      this.nuevoNombre = '';
    } catch (error: any) {
      console.error('❌ Error:', error);
      alert(error.message);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}