import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { Trie } from '../../data-structures/trie';
import { Song } from '../../models/song';

@Component({
  selector: 'app-song-search',
  imports: [DecimalPipe],
  templateUrl: './song-search.html',
  styleUrl: './song-search.scss',
})
export class SongSearch {
  private readonly music = inject(MusicService);

  protected readonly query = signal('');
  protected readonly exactResult = signal<{ query: string; songs: Song[] } | null>(null);

  protected readonly suggestions = computed(() => this.music.suggest(this.query(), 8));
  protected readonly prefixLength = computed(() => Trie.normalize(this.query()).length);
  protected readonly hasPrefix = computed(() => this.music.hasPrefix(this.query()));
  protected readonly selectedId = this.music.selectedId;

  protected onInput(value: string): void {
    this.query.set(value);
    this.exactResult.set(null);
  }

  protected verify(): void {
    const q = this.query().trim();
    if (!q) return;
    this.exactResult.set({ query: q, songs: this.music.exists(q) });
  }

  protected pick(song: Song): void {
    this.query.set(song.title);
    this.music.select(song.id);
    this.exactResult.set({ query: song.title, songs: this.music.exists(song.title) });
  }

  protected clear(): void {
    this.query.set('');
    this.exactResult.set(null);
  }

  protected head(title: string): string {
    return title.slice(0, this.prefixLength());
  }

  protected tail(title: string): string {
    return title.slice(this.prefixLength());
  }
}
