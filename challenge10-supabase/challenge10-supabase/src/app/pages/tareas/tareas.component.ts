import { Component, OnDestroy, OnInit, inject, signal, computed } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RealtimeChannel } from '@supabase/supabase-js';
import { SupabaseService } from '../../services/supabase.service';
import { Tarea, TareasService } from '../../services/tareas.service';

@Component({
  selector: 'app-tareas',
  imports: [FormsModule],
  templateUrl: './tareas.component.html',
})
export class TareasComponent implements OnInit, OnDestroy {
  protected srv = inject(TareasService);
  private sb = inject(SupabaseService).client;
  private canal?: RealtimeChannel;

  tareas = signal<Tarea[]>([]);
  pendientes = computed(() => this.tareas().filter((t) => !t.completada).length);
  nueva = '';
  editandoId = signal<number | null>(null);
  textoEdicion = '';
  error = signal('');
  enVivo = signal(false);

  async ngOnInit() {
    await this.cargar();
    this.canal = this.srv.escuchar(
      () => this.cargar(),
      (conectado) => this.enVivo.set(conectado)
    );
  }

  async cargar() {
    const { data, error } = await this.srv.listar();
    if (error) this.error.set(error.message);
    this.tareas.set(data ?? []);
  }

  async agregar() {
    const titulo = this.nueva.trim();
    if (!titulo) return;
    const { error } = await this.srv.crear(titulo);
    if (error) return this.error.set(error.message);
    this.nueva = '';
  }

  async completar(t: Tarea) {
    const { error } = await this.srv.completar(t.id, !t.completada);
    if (error) this.error.set(error.message);
  }

  empezarEdicion(t: Tarea) {
    this.editandoId.set(t.id);
    this.textoEdicion = t.titulo;
  }

  async guardarEdicion(t: Tarea) {
    const titulo = this.textoEdicion.trim();
    if (titulo && titulo !== t.titulo) {
      const { error } = await this.srv.editar(t.id, titulo);
      if (error) this.error.set(error.message);
    }
    this.editandoId.set(null);
  }

  async borrar(t: Tarea) {
    const { error } = await this.srv.borrar(t.id);
    if (error) this.error.set(error.message);
  }

  ngOnDestroy() {
    if (this.canal) this.sb.removeChannel(this.canal);
  }
}
