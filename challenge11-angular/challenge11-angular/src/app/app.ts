import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GraphView } from './components/graph-view/graph-view';
import { SocialNode } from './models/social';
import { SocialGraphService } from './services/social-graph.service';

@Component({
  selector: 'app-root',
  imports: [FormsModule, GraphView],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  protected readonly graph = inject(SocialGraphService);

  protected readonly selectedCity = signal('');
  protected readonly peopleInSelectedCity = computed(() => {
    const city = this.selectedCity();
    return city ? this.graph.peopleInCity(city) : [];
  });

  private readonly focusedPerson = signal<string | null>(null);
  protected readonly highlight = computed<Set<string> | null>(() => {
    this.graph.nodes();
    const city = this.selectedCity() ? this.graph.findCity(this.selectedCity()) : null;
    const id = city?.id ?? this.focusedPerson();
    if (!id || !this.graph.searchNode(id)) return null;
    return new Set([id, ...this.graph.neighbors(id).map((n) => n.id)]);
  });

  protected readonly message = signal<{ text: string; ok: boolean } | null>(null);

  protected newCity = '';
  protected newPerson = { name: '', age: null as number | null, city: '' };
  protected friendship = { a: '', b: '' };
  protected toRemove = '';

  selectCity(name: string): void {
    this.selectedCity.set(name);
    this.focusedPerson.set(null);
    if (name) this.graph.printPeopleInCity(name);
  }

  onNodeClick(node: SocialNode): void {
    if (node.type === 'city') {
      this.selectCity(node.name);
      return;
    }
    const city = this.graph.searchNode(node.city);
    const friends = this.graph.friendsOf(node.name).map((f) => f.name);
    this.selectedCity.set('');
    this.focusedPerson.set(node.id);
    this.message.set({
      text: `${node.name} vive en ${city?.name}. Amigos: ${friends.join(', ') || 'ninguno'}`,
      ok: true,
    });
  }

  clearSelection(): void {
    this.selectedCity.set('');
    this.focusedPerson.set(null);
    this.message.set(null);
  }

  addCity(): void {
    this.run(() => {
      this.graph.addCity(this.newCity);
      const text = `Ciudad "${this.newCity}" agregada`;
      this.newCity = '';
      return text;
    });
  }

  addPerson(): void {
    this.run(() => {
      const { name, age, city } = this.newPerson;
      this.graph.addPerson(name, age ?? NaN, city || this.graph.cities()[0]?.name);
      this.newPerson = { name: '', age: null, city };
      return `${name} agregado(a)`;
    });
  }

  addFriendship(): void {
    this.run(() => {
      const { a, b } = this.friendship;
      return this.graph.addFriendship(a, b) ? `${a} y ${b} ahora son amigos` : `${a} y ${b} ya eran amigos`;
    });
  }

  removeNode(): void {
    this.run(() => {
      const node = this.graph.searchNode(this.toRemove);
      if (!node) throw new Error('Selecciona un nodo');
      this.graph.removeNode(node.id);
      if (node.type === 'city' && this.selectedCity() === node.name) this.selectedCity.set('');
      if (this.focusedPerson() === node.id) this.focusedPerson.set(null);
      this.toRemove = '';
      return `"${node.name}" eliminado`;
    });
  }

  private run(action: () => string): void {
    try {
      this.message.set({ text: action(), ok: true });
    } catch (e) {
      this.message.set({ text: (e as Error).message, ok: false });
    }
  }
}
