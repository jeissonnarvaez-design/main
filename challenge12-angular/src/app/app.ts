import { JsonPipe } from '@angular/common';
import { Component, computed, inject, signal } from '@angular/core';
import { SearchEngineService } from './services/search-engine.service';

@Component({
  selector: 'app-root',
  imports: [JsonPipe],
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App {
  protected readonly engine = inject(SearchEngineService);

  protected readonly prefix = signal('air');
  protected readonly k = signal(2);

  protected readonly newName = signal('');
  protected readonly newPopularity = signal(50);

  /** Se recalcula cada vez que cambia el prefijo, K o la lista de productos. */
  protected readonly results = computed(() => {
    this.engine.products(); // dependencia: recalcular al insertar
    return this.engine.searchTopK(this.prefix(), this.k());
  });

  constructor() {
    // Datos del ejemplo del challenge
    this.engine.insert('air max', 90);
    this.engine.insert('air force', 95);
    this.engine.insert('air jordan', 85);
    this.engine.insert('adidas boost', 80);
  }

  protected addProduct(): void {
    if (!this.newName().trim()) return;
    this.engine.insert(this.newName(), this.newPopularity());
    this.newName.set('');
    this.newPopularity.set(50);
  }

  protected value(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  protected numberValue(event: Event): number {
    const n = Number((event.target as HTMLInputElement).value);
    return Number.isFinite(n) ? n : 0;
  }
}
