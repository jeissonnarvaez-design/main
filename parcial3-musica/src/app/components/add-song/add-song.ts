import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MusicService } from '../../services/music.service';
import { GENRES, Genre } from '../../models/song';

@Component({
  selector: 'app-add-song',
  imports: [FormsModule],
  templateUrl: './add-song.html',
  styleUrl: './add-song.scss',
})
export class AddSong {
  private readonly music = inject(MusicService);

  protected readonly genres = GENRES;
  protected readonly songs = this.music.songs;

  protected title = '';
  protected artist = '';
  protected genre: Genre = 'pop';
  protected plays = 1000;
  protected readonly related = signal<Set<string>>(new Set());
  protected readonly filter = signal('');
  protected readonly message = signal<{ ok: boolean; text: string } | null>(null);

  protected readonly filteredSongs = computed(() => {
    const f = this.filter().toLowerCase().trim();
    return this.songs().filter(
      (s) => !f || s.title.toLowerCase().includes(f) || s.artist.toLowerCase().includes(f),
    );
  });

  protected toggle(id: string): void {
    this.related.update((set) => {
      const next = new Set(set);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  protected submit(): void {
    const result = this.music.addSong({
      title: this.title,
      artist: this.artist,
      genre: this.genre,
      plays: Number(this.plays),
      relatedIds: [...this.related()],
    });

    if (result.ok) {
      const n = this.related().size;
      this.message.set({
        ok: true,
        text: `«${result.song.title}» insertada en el Trie, el Heap y el Grafo (${n} conexión${n === 1 ? '' : 'es'}).`,
      });
      this.music.select(result.song.id);
      this.title = '';
      this.artist = '';
      this.plays = 1000;
      this.related.set(new Set());
      this.filter.set('');
    } else {
      this.message.set({ ok: false, text: result.error });
    }
  }
}
