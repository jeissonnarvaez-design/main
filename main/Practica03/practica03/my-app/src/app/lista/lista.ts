import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeloDatos } from '../modelo.datos/modelo.datos';

@Component({
  selector: 'app-lista',
  standalone: true,
  imports: [],
  templateUrl: './lista.html',
  styleUrl: './lista.css',
})
export class Lista {
  @Input() contactos: ModeloDatos[] = [];
  @Output() onDelete = new EventEmitter<number>();

  forwardDelete(id: number): void {
    this.onDelete.emit(id);
  }
}
