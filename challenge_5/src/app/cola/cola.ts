export interface Persona {
  id: string;
  nombre: string;
  montoRetiro: number;
  fechaLlegada: Date;
}

export class Queue <T> {
  private items: T[] = [];

  enqueue(element: T): void {
    this.items.push(element);
  }

  dequeue(): T | null {
    return this.items.length > 0 ? this.items.shift()! : null;
  }

  peek(): T | null {
    return this.items.length > 0 ? this.items[0] : null;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  toArray(): T[] {
    return [...this.items];
  }
}