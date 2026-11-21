import { Component, OnInit, inject, signal } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
})
export class PerfilComponent implements OnInit {
  private sb = inject(SupabaseService).client;
  protected auth = inject(AuthService);

  url = signal('');
  msg = signal('');
  subiendo = signal(false);

  async ngOnInit() {
    const { data: { user } } = await this.sb.auth.getUser();
    if (!user) return;
    const { data } = await this.sb.storage
      .from('avatars')
      .list(user.id, { limit: 1, sortBy: { column: 'created_at', order: 'desc' } });
    const ultimo = data?.find((f) => f.id);
    if (ultimo) {
      this.url.set(
        this.sb.storage.from('avatars').getPublicUrl(`${user.id}/${ultimo.name}`).data.publicUrl
      );
    }
  }

  async subir(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const { data: { user } } = await this.sb.auth.getUser();
    if (!user) return;

    this.subiendo.set(true);
    this.msg.set('');
    const nombre = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const ruta = `${user.id}/${Date.now()}-${nombre}`;

    const { error } = await this.sb.storage
      .from('avatars')
      .upload(ruta, file, { upsert: true });
    this.subiendo.set(false);

    if (error) {
      this.msg.set(error.message);
      return;
    }

    this.url.set(this.sb.storage.from('avatars').getPublicUrl(ruta).data.publicUrl);
    this.msg.set('Avatar actualizado');
  }
}
