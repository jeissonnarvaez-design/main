import { Injectable, computed, signal } from '@angular/core';
import { Graph } from '../models/graph';
import { City, Person, SocialNode, nodeLabel, slug } from '../models/social';

@Injectable({ providedIn: 'root' })
export class SocialGraphService {
  private readonly graph = new Graph<SocialNode>();

  private readonly version = signal(0);

  readonly nodes = computed(() => (this.version(), [...this.graph.nodes]));
  readonly edges = computed(() => (this.version(), this.graph.edges()));
  readonly cities = computed(() => this.nodes().filter((n): n is City => n.type === 'city'));
  readonly people = computed(() => this.nodes().filter((n): n is Person => n.type === 'person'));
  readonly printed = computed(() => (this.version(), this.graph.print(nodeLabel, (n) => n.name)));

  constructor() {
    this.loadSampleData();
  }

  addCity(name: string): City {
    if (!name?.trim()) throw new Error('La ciudad debe tener nombre');
    const city = this.graph.addNode({ id: slug('city', name), type: 'city', name: name.trim() }) as City;
    this.changed();
    return city;
  }

  addPerson(name: string, age: number, cityName: string): Person {
    if (!name?.trim()) throw new Error('La persona debe tener nombre');
    age = Number(age);
    if (!Number.isInteger(age) || age < 0) throw new Error('La edad debe ser un entero >= 0');
    const city = this.findCity(cityName);
    if (!city) throw new Error(`La ciudad "${cityName}" no existe`);

    const person = this.graph.addNode({
      id: slug('person', name), type: 'person', name: name.trim(), age, city: city.id,
    }) as Person;
    this.graph.addEdge(person.id, city.id);
    this.changed();
    return person;
  }

  addFriendship(nameA: string, nameB: string): boolean {
    const a = this.findPerson(nameA);
    const b = this.findPerson(nameB);
    if (!a || !b) throw new Error(`No existe "${nameA}" o "${nameB}"`);
    const added = this.graph.addEdge(a.id, b.id);
    this.changed();
    return added;
  }

  moveTo(personName: string, cityName: string): void {
    const p = this.findPerson(personName);
    const c = this.findCity(cityName);
    if (!p || !c) throw new Error('Persona o ciudad inexistente');
    this.graph.removeEdge(p.id, p.city);
    p.city = c.id;
    this.graph.addEdge(p.id, c.id);
    this.changed();
  }

  removeNode(id: string): boolean {
    const node = this.graph.searchNode(id);
    if (!node) return false;
    if (node.type === 'city') {
      this.peopleInCity(node.name).forEach((p) => this.graph.removeNode(p.id));
    }
    this.graph.removeNode(id);
    this.changed();
    return true;
  }

  searchNode(id: string): SocialNode | null {
    return this.graph.searchNode(id);
  }

  neighbors(id: string): SocialNode[] {
    return this.graph.printAdjacency(id);
  }

  isEmpty(): boolean {
    return this.graph.isEmpty();
  }

  findCity(name: string): City | null {
    return this.graph.searchNode(slug('city', name ?? '')) as City | null;
  }

  findPerson(name: string): Person | null {
    return this.graph.searchNode(slug('person', name ?? '')) as Person | null;
  }

  peopleInCity(cityName: string): Person[] {
    const city = this.findCity(cityName);
    if (!city) return [];
    return this.graph.printAdjacency(city.id).filter((n): n is Person => n.type === 'person');
  }

  printPeopleInCity(cityName: string): string {
    const people = this.peopleInCity(cityName);
    const text =
      `Personas que viven en ${cityName} (${people.length}):\n` +
      (people.length ? people.map((p) => `  - ${p.name}, ${p.age} años`).join('\n') : '  (nadie)');
    console.log(text);
    return text;
  }

  friendsOf(name: string): Person[] {
    const p = this.findPerson(name);
    if (!p) return [];
    return this.graph.printAdjacency(p.id).filter((n): n is Person => n.type === 'person');
  }

  private loadSampleData(): void {
    ['Cali', 'Bogotá', 'Medellín', 'Cartagena'].forEach((c) => this.addCity(c));

    const people: [string, number, string][] = [
      ['Ana', 21, 'Cali'], ['Carlos', 23, 'Cali'], ['Valentina', 20, 'Cali'],
      ['Juan', 25, 'Bogotá'], ['Sofía', 22, 'Bogotá'],
      ['Mateo', 24, 'Medellín'], ['Laura', 19, 'Medellín'], ['Andrés', 30, 'Medellín'],
      ['Camila', 27, 'Cartagena'], ['Diego', 26, 'Cartagena'],
    ];
    people.forEach(([n, a, c]) => this.addPerson(n, a, c));

    const friendships: [string, string][] = [
      ['Ana', 'Carlos'], ['Ana', 'Valentina'], ['Ana', 'Juan'], ['Carlos', 'Mateo'],
      ['Juan', 'Sofía'], ['Sofía', 'Laura'], ['Mateo', 'Laura'], ['Andrés', 'Camila'],
      ['Camila', 'Diego'], ['Diego', 'Valentina'], ['Laura', 'Andrés'],
    ];
    friendships.forEach(([a, b]) => this.addFriendship(a, b));
  }

  private changed(): void {
    this.version.update((v) => v + 1);
  }
}
