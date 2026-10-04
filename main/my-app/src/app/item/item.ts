import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ModeloDatos } from '../modelo.datos/modelo.datos';

@Component({
  selector: 'app-item',
  standalone: true,
  templateUrl: './item.html',
  styleUrl: './item.css',
})
export class Item {
  @Input({ required: true }) contacto!: ModeloDatos;
  @Output() onDelete = new EventEmitter<number>();

  handleDelete(e: any): void {
    this.onDelete.emit(this.contacto.id);
  }
}
