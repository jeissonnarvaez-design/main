import { Component, signal } from '@angular/core';
import { Loader } from './loader/loader';
import { Lista } from './lista/lista';
import { Formulario } from './formulario/formulario';
import { ModeloDatos } from './modelo.datos/modelo.datos';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Loader, Lista, Formulario],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  title = signal('Agenda de Contactos');
  isLoading = signal<boolean>(true);
  contactos = signal<ModeloDatos[]>([]);

  ngOnInit(): void {
    
    setTimeout(() => {
      this.contactos.set([
        { id:1, nombre: 'Jeisson Narvaez', telefono: '3052278945' },
        { id:2, nombre: 'Angela Ospina', telefono: '31556569175' },
        { id:3, nombre: 'Daniela Vasquez', telefono: '3459526784' }
  ])
this.isLoading.set(false);
    }, 2000);
  }

  addContact(newContact: Omit<ModeloDatos, 'id'>): void {
    const nuevoContacto: ModeloDatos = {
      ...newContact,
      id: Date.now()
    };
    this.contactos.set([...this.contactos(), nuevoContacto]);
  }

  deleteContact(id: number): void {
    this.contactos.set(this.contactos().filter(contacto => contacto.id !== id));
  }

}
