export class Nodo {
  public id: number;
  public valor: number;
  public izquierdo: Nodo | null;
  public derecho: Nodo | null;

  constructor(id: number, valor: number) {
    this.id = id;
    this.valor = valor;
    this.izquierdo = null;
    this.derecho = null;
  }

  isLeaf(): boolean {
    return this.izquierdo === null && this.derecho === null;
  }
}