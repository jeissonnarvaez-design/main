export class MenuNode {
  titulo: string;
  enlace: string;
  componente: string;
  hijos: MenuNode[];

  constructor(titulo: string, enlace: string = '', componente: string = '') {
    this.titulo = titulo;
    this.enlace = enlace;
    this.componente = componente;
    this.hijos = [];
  }

  agregarHijo(nodo: MenuNode): void {
    this.hijos.push(nodo);
  }

  esHoja(): boolean {
    return this.hijos.length === 0;
  }
}