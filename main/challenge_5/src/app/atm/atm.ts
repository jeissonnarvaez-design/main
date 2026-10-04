import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Queue, Persona } from '../cola/cola';

@Component({
  selector: 'app-atm-queue',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './atm.html',
  styleUrls: ['./atm.css']
})
export class AtmQueueComponent {
  private queue = new Queue();

  colaPersonas = signal<Persona[]>([]);

  nuevoNombre: string = '';
  nuevoMonto: number | null = null;

  constructor() {
    this.cargarMockData();
  }

  cargarMockData(): void {
    const mockData: Persona[] = [
      {
        id: crypto.randomUUID(),
        nombre: 'Carlos Mendoza',
        montoRetiro: 250000,
        fechaLlegada: new Date(Date.now() - 1000 * 60 * 15)
      },
      {
        id: crypto.randomUUID(),
        nombre: 'María Paula López',
        montoRetiro: 100000,
        fechaLlegada: new Date(Date.now() - 1000 * 60 * 10)
      },
      {
        id: crypto.randomUUID(),
        nombre: 'Andrés Felipe Gómez',
        montoRetiro: 500000,
        fechaLlegada: new Date(Date.now() - 1000 * 60 * 2)
      }
    ];

    mockData.forEach(persona => this.queue.enqueue(persona));
    this.actualizarSignal();
  }

  agregarPersona(): void {
    if (!this.nuevoNombre.trim() || !this.nuevoMonto || this.nuevoMonto <= 0) {
      alert('Por favor ingrese un nombre válido y un monto mayor a 0.');
      return;
    }

    const nuevaPersona: Persona = {
      id: crypto.randomUUID(),
      nombre: this.nuevoNombre.trim(),
      montoRetiro: this.nuevoMonto,
      fechaLlegada: new Date()
    };

    this.queue.enqueue(nuevaPersona);
    this.actualizarSignal();

    this.nuevoNombre = '';
    this.nuevoMonto = null;
  }

  atenderPersona(): void {
    const atendida: Persona | undefined = this.queue.dequeue() as Persona | undefined;
    if (atendida) {
      alert(`Atendiendo a: ${atendida.nombre} - Retiro: ${atendida.montoRetiro.toLocaleString()}`);
      this.actualizarSignal();
    }
  }

  private actualizarSignal(): void {
    this.colaPersonas.set(this.queue.toArray() as Persona[]);
  }
}