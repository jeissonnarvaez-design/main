import { Component, OnDestroy, inject, signal } from '@angular/core';
import { GiphyService } from './services/giphy.service';
import { HttpClientKind } from './models/giphy.models';

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnDestroy {
  protected readonly giphy = inject(GiphyService);
  protected readonly texto = signal('');
  protected readonly sugerencias = ['gatos', 'perros', 'feliz', 'baile', 'fútbol', 'wow'];

  private debounce?: ReturnType<typeof setTimeout>;

  onInput(valor: string) {
    this.texto.set(valor);
    clearTimeout(this.debounce);
    this.debounce = setTimeout(() => this.buscar(), 400);
  }

  buscar(valor = this.texto()) {
    clearTimeout(this.debounce);
    this.texto.set(valor);
    if (valor.trim()) this.giphy.buscar(valor);
  }

  cambiarCliente(kind: HttpClientKind) {
    this.giphy.cliente.set(kind);
    if (this.giphy.query()) this.giphy.buscar(this.giphy.query());
  }

  ngOnDestroy() {
    clearTimeout(this.debounce);
  }
}
