import { Injectable, signal } from '@angular/core';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { Nodo } from '../models/nodo/nodo';

@Injectable({ providedIn: 'root' })
export class ArbolService {
  raiz = signal<Nodo | null>(null);

  async guardarArbol(usuarioEmail: string) {
    if (!this.raiz()) return;
    const docRef = doc(db, 'arboles', usuarioEmail);
    await setDoc(docRef, { estructura: this.serializarNodo(this.raiz()!) });
  }

  async cargarArbol(usuarioEmail: string) {
  console.log('[arbolService] cargarArbol INICIO con:', usuarioEmail);
  
  try {
    const docRef = doc(db, 'arboles', usuarioEmail);
    console.log('Buscando doc en Firestore...');
    
    const docSnap = await getDoc(docRef);
    console.log('docSnap.exists():', docSnap.exists());
    
    if (docSnap.exists()) {
      console.log('Documento encontrado');
      const data = docSnap.data();
      const deserializado = this.deserializarNodo(data['estructura']);
      console.log('Árbol deserializado:', deserializado);
      this.raiz.set(deserializado);
    } else {
      console.log('No existe, creando raíz nueva');
      const nuevaRaiz = new Nodo('Raíz', 'carpeta', usuarioEmail);
      this.raiz.set(nuevaRaiz);
      console.log('Raíz creada localmente:', nuevaRaiz);
      
      await this.guardarArbol(usuarioEmail);
      console.log('Raíz guardada en Firestore');
    }
    
    console.log('cargarArbol FIN. raiz() =', this.raiz());
  } catch (error) {
    console.error('ERROR en cargarArbol:', error);
  }
}

  private serializarNodo(nodo: Nodo): any {
    return {
      id: nodo.id,
      nombre: nodo.nombre,
      tipo: nodo.tipo,
      creadoPor: nodo.creadoPor,
      hijos: nodo.hijos.map(h => this.serializarNodo(h))
    };
  }

  private deserializarNodo(data: any): Nodo {
    const nodo = new Nodo(data.nombre, data.tipo, data.creadoPor, data.id);
    nodo.hijos = data.hijos.map((h: any) => this.deserializarNodo(h));
    return nodo;
  }

  buscarNodo(id: string, nodoActual: Nodo = this.raiz()!): Nodo | null {
    if (nodoActual.id === id) return nodoActual;
    for (const hijo of nodoActual.hijos) {
      const encontrado = this.buscarNodo(id, hijo);
      if (encontrado) return encontrado;
    }
    return null;
  }
}