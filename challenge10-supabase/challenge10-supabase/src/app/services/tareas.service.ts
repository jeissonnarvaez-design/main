// services/tareas.service.ts
import { Injectable, inject } from '@angular/core';
import { SupabaseService } from './supabase.service';

export interface Tarea {
  id: number;
  titulo: string;
  completada: boolean;
  user_id: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class TareasService {
  private sb = inject(SupabaseService).client;

  listar() {
    return this.sb
      .from('tareas')
      .select('*')
      .order('created_at', { ascending: false })
      .returns<Tarea[]>();
  }

  crear(titulo: string) {
    return this.sb.from('tareas').insert({ titulo });
  }

  completar(id: number, valor: boolean) {
    return this.sb.from('tareas').update({ completada: valor }).eq('id', id);
  }

  editar(id: number, titulo: string) {
    return this.sb.from('tareas').update({ titulo }).eq('id', id);
  }

  borrar(id: number) {
    return this.sb.from('tareas').delete().eq('id', id);
  }

  escuchar(alCambiar: () => void, alEstado?: (conectado: boolean) => void) {
    return this.sb
      .channel('tareas-ng')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'tareas' }, alCambiar)
      .subscribe((status) => alEstado?.(status === 'SUBSCRIBED'));
  }
}
