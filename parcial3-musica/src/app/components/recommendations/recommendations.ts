import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { GENRES, Song } from '../../models/song';

interface PositionedNode {
  song: Song;
  x: number;
  y: number;
  lx: number;
  ly: number;
  anchor: 'start' | 'end' | 'middle';
}

const CENTER = 300;
const RADIUS = 215;

@Component({
  selector: 'app-recommendations',
  imports: [DecimalPipe],
  templateUrl: './recommendations.html',
  styleUrl: './recommendations.scss',
})
export class Recommendations {
  private readonly music = inject(MusicService);

  protected readonly songs = this.music.songs;
  protected readonly selected = this.music.selected;
  protected readonly targetId = signal<string>('');
  protected readonly feedback = signal<string>('');

  protected readonly recommendations = computed(() => {
    const s = this.selected();
    return s ? this.music.recommend(s.id, 2) : [];
  });
  protected readonly direct = computed(() => this.recommendations().filter((r) => r.depth === 1));
  protected readonly indirect = computed(() => this.recommendations().filter((r) => r.depth === 2));

  private readonly depthById = computed(() => {
    const map = new Map<string, number>();
    const s = this.selected();
    if (s) map.set(s.id, 0);
    for (const r of this.recommendations()) map.set(r.song.id, r.depth);
    return map;
  });

  protected readonly target = computed(() => this.music.getSong(this.targetId()) ?? null);
  protected readonly path = computed(() => {
    const s = this.selected();
    const t = this.target();
    this.music.graphData();
    return s && t ? this.music.path(s.id, t.id) : [];
  });
  protected readonly connected = computed(() => {
    const s = this.selected();
    const t = this.target();
    return !!s && !!t && this.music.neighbors(s.id).some((n) => n.id === t.id);
  });

  protected readonly layout = computed(() => {
    const { nodes, edges } = this.music.graphData();
    const order = GENRES.map((g) => g.value);
    const sorted = [...nodes].sort(
      (a, b) => order.indexOf(a.genre) - order.indexOf(b.genre) || a.title.localeCompare(b.title),
    );
    const pos = new Map<string, PositionedNode>();
    sorted.forEach((song, i) => {
      const angle = (2 * Math.PI * i) / sorted.length - Math.PI / 2;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      pos.set(song.id, {
        song,
        x: CENTER + RADIUS * cos,
        y: CENTER + RADIUS * sin,
        lx: CENTER + (RADIUS + 18) * cos,
        ly: CENTER + (RADIUS + 18) * sin + 4,
        anchor: Math.abs(cos) < 0.2 ? 'middle' : cos > 0 ? 'start' : 'end',
      });
    });
    const pathIds = this.path().map((s) => s.id);
    const onPath = (a: string, b: string) => {
      const i = pathIds.indexOf(a);
      return i >= 0 && (pathIds[i + 1] === b || pathIds[i - 1] === b);
    };
    const sel = this.selected()?.id;
    return {
      nodes: [...pos.values()],
      edges: edges.map(([a, b]) => ({
        a: pos.get(a)!,
        b: pos.get(b)!,
        active: a === sel || b === sel,
        path: onPath(a, b),
      })),
    };
  });

  protected depth(id: string): number | undefined {
    return this.depthById().get(id);
  }

  protected short(title: string): string {
    return title.length > 16 ? title.slice(0, 15) + '…' : title;
  }

  protected select(id: string): void {
    this.music.select(id || null);
    this.feedback.set('');
  }

  protected toggleConnection(): void {
    const s = this.selected();
    const t = this.target();
    if (!s || !t) return;
    if (this.connected()) {
      this.music.disconnect(s.id, t.id);
      this.feedback.set(`Arista eliminada: ${s.title} — ${t.title}`);
    } else if (this.music.connect(s.id, t.id)) {
      this.feedback.set(`Arista creada: ${s.title} — ${t.title}`);
    } else {
      this.feedback.set('No se puede conectar una canción consigo misma.');
    }
  }

  protected removeSelected(): void {
    const s = this.selected();
    if (!s) return;
    this.music.removeSong(s.id);
    this.feedback.set(`«${s.title}» se eliminó del Trie, el Heap y el Grafo.`);
  }
}
