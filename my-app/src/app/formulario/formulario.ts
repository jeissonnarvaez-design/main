import { Component, EventEmitter, output, Output } from '@angular/core';

@Component({
  selector: 'app-formulario',
  standalone: true,
  templateUrl: './formulario.html',
  styleUrl: './formulario.css',
})

export class Formulario {
  @Output() onAdd = new EventEmitter<{nombre: string, telefono: string}>();

  currentName: string = '';
  currentPhone: string = '';

  captureName(e: any): void {
    this.currentName = e.target.value;
  }

  capturePhone(e: any): void {
    this.currentPhone = e.target.value;
  }

  submit(e: any): void {
    e.preventDefault();
    if (!this.currentName || !this.currentPhone) return;

    this.onAdd.emit({ nombre: this.currentName, telefono: this.currentPhone});

    this.currentName = '';
    this.currentPhone = '';
    e.target.reset();
  }

}
