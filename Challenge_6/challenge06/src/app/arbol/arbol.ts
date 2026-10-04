import { Nodo } from '../nodos/nodos';

export class Arbol {
  public raiz: Nodo | null;

  constructor() {
    this.raiz = null;
  }

  public agregarNodo(id: number, valor: number): void {
    const nuevoNodo = new Nodo(id, valor);

    if (this.raiz === null) {
      this.raiz = nuevoNodo;
      return;
    }

    let actual: Nodo = this.raiz;
    while (true) {
      if (id < actual.id) {
        if (actual.izquierdo === null) {
          actual.izquierdo = nuevoNodo;
          return;
        }
        actual = actual.izquierdo;
      } else if (id > actual.id) {
        if (actual.derecho === null) {
          actual.derecho = nuevoNodo;
          return;
        }
        actual = actual.derecho;
      } else {
        console.log(`El nodo con ID ${id} ya existe.`);
        return;
      }
    }
  }

  public contiene(idBuscado: number): boolean {
    let actual = this.raiz;
    while (actual !== null) {
      if (idBuscado === actual.id) return true;
      if (idBuscado < actual.id) actual = actual.izquierdo;
      else actual = actual.derecho;
    }
    return false;
  }

  public recorridoEnOrden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (nodo !== null) {
      this.recorridoEnOrden(nodo.izquierdo, resultado);
      resultado.push(nodo.id);
      this.recorridoEnOrden(nodo.derecho, resultado);
    }
    return resultado;
  }

  public recorridoPreOrden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (nodo !== null) {
      resultado.push(nodo.id);
      this.recorridoPreOrden(nodo.izquierdo, resultado);
      this.recorridoPreOrden(nodo.derecho, resultado);
    }
    return resultado;
  }

  public recorridoPostOrden(nodo: Nodo | null = this.raiz, resultado: number[] = []): number[] {
    if (nodo !== null) {
      this.recorridoPostOrden(nodo.izquierdo, resultado);
      this.recorridoPostOrden(nodo.derecho, resultado);
      resultado.push(nodo.id);
    }
    return resultado;
  }
}