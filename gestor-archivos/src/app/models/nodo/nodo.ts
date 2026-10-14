export class Nodo {
  id: string;
  nombre: string;
  tipo: 'carpeta' | 'archivo';
  creadoPor: string;
  hijos: Nodo[];

  constructor(nombre: string, tipo: 'carpeta' | 'archivo', creadoPor: string, id?: string) {
    this.id = id || crypto.randomUUID();
    this.nombre = nombre;
    this.tipo = tipo;
    this.creadoPor = creadoPor;
    this.hijos = [];
  }

  agregarHijo(nodo: Nodo) {
    if (this.tipo === 'archivo') {
      throw new Error('Un archivo no puede contener hijos.');
    }
    this.hijos.push(nodo);
  }
}