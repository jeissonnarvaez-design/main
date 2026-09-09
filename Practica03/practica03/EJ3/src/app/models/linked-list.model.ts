//Lista simplemente enlazada para almacenar canciones

export interface Cancion {
  id: number;
  titulo: string;
  artista: string;
  duracion: string; 
}

export class NodoCancion {
  value: Cancion;
  next: NodoCancion | null;

  constructor(value: Cancion) {
    this.value = value;
    this.next = null;
  }
}

export class ListaCanciones {
  head: NodoCancion | null = null;
  tail: NodoCancion | null = null;
  length: number = 0;

  append(cancion: Cancion): void {
    const nuevoNodo = new NodoCancion(cancion);
    if (!this.head) {
      this.head = nuevoNodo;
      this.tail = nuevoNodo;
    } else {
      if (this.tail) {
        this.tail.next = nuevoNodo;
        this.tail = nuevoNodo;
      }
      this.length++;
    }
}
}

// Lista doblemente enlazada

export interface PageHistory {
  url: string;
  titulo: string;
}

export class NodoPagina {
  value: PageHistory;
  next: NodoPagina | null = null;
  prev: NodoPagina | null = null;

  constructor(value: PageHistory) {
    this.value = value;
  }
}

export class ListaPaginas {
  head: NodoPagina | null = null;
  tail: NodoPagina | null = null;
  length: number = 0;

  append(pagina: PageHistory): void {
    const nuevoNodo = new NodoPagina(pagina);
    if (!this.head) {
      this.head = nuevoNodo;
      this.tail = nuevoNodo;
    } else {
      if (this.tail) {
        this.tail.next = nuevoNodo;
        nuevoNodo.prev = this.tail;
        this.tail = nuevoNodo;
      }
    }
    this.length++;
  }
}