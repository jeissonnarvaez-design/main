import { Injectable, computed, signal } from '@angular/core';
import { Trie } from '../data-structures/trie';
import { MaxHeap } from '../data-structures/max-heap';
import { UndirectedGraph } from '../data-structures/graph';
import { Genre, Recommendation, Song } from '../models/song';
import { SEED_RELATIONS, SEED_SONGS } from '../data/songs.data';

export interface NewSong {
  title: string;
  artist: string;
  genre: Genre;
  plays: number;
  relatedIds: string[];
}

@Injectable({ providedIn: 'root' })
export class MusicService {
  private readonly trie = new Trie();
  private readonly heap = new MaxHeap<Song>((s) => s.plays);
  private readonly graph = new UndirectedGraph();
  private readonly byId = new Map<string, Song>();
  private nextId = 1;

  private readonly version = signal(0);
  readonly selectedId = signal<string | null>(null);

  constructor() {
    for (const song of SEED_SONGS) this.register({ ...song });
    for (const [a, b] of SEED_RELATIONS) this.graph.addEdge(a, b);
    this.selectedId.set('s1');
    this.touch();
  }

  readonly songs = computed(() => {
    this.version();
    return [...this.byId.values()].sort((a, b) => a.title.localeCompare(b.title));
  });

  readonly selected = computed(() => {
    this.version();
    const id = this.selectedId();
    return id ? (this.byId.get(id) ?? null) : null;
  });

  readonly stats = computed(() => {
    this.version();
    const songs = [...this.byId.values()];
    return {
      songs: songs.length,
      plays: songs.reduce((acc, s) => acc + s.plays, 0),
      trieNodes: this.trie.nodeCount,
      edges: this.graph.edgeCount,
      top: this.heap.peek() ?? null,
    };
  });

  readonly heapArray = computed(() => {
    this.version();
    return this.heap.toArray();
  });

  readonly graphData = computed(() => {
    this.version();
    return {
      nodes: this.graph.nodes().map((id) => this.byId.get(id)!),
      edges: this.graph.edges(),
    };
  });

  suggest(prefix: string, limit = 8): Song[] {
    this.version();
    if (!prefix.trim()) return [];
    const matches = this.trie
      .suggestions(prefix)
      .flatMap((m) => m.ids.map((id) => this.byId.get(id)!));
    return new MaxHeap<Song>((s) => s.plays, matches).topK(limit);
  }

  exists(title: string): Song[] {
    this.version();
    const match = this.trie.get(title);
    return match ? match.ids.map((id) => this.byId.get(id)!) : [];
  }

  hasPrefix(prefix: string): boolean {
    this.version();
    return this.trie.startsWith(prefix);
  }

  addSong(data: NewSong): { ok: true; song: Song } | { ok: false; error: string } {
    const title = data.title.trim();
    const artist = data.artist.trim();
    if (!title || !artist) return { ok: false, error: 'El título y el artista son obligatorios.' };
    if (!Number.isFinite(data.plays) || data.plays < 0) {
      return { ok: false, error: 'Las reproducciones deben ser un número positivo.' };
    }
    const duplicate = this.exists(title).some(
      (s) => Trie.normalize(s.artist) === Trie.normalize(artist),
    );
    if (duplicate) return { ok: false, error: `"${title}" de ${artist} ya está en el catálogo.` };

    const song: Song = {
      id: `n${this.nextId++}`,
      title,
      artist,
      genre: data.genre,
      plays: Math.floor(data.plays),
    };
    this.register(song);
    for (const rel of data.relatedIds) this.graph.addEdge(song.id, rel);
    this.touch();
    return { ok: true, song };
  }

  removeSong(id: string): void {
    const song = this.byId.get(id);
    if (!song) return;
    this.trie.remove(song.title, id);
    this.graph.removeNode(id);
    this.byId.delete(id);
    this.heap.heapify([...this.byId.values()]);
    if (this.selectedId() === id) this.selectedId.set(null);
    this.touch();
  }


  topK(k: number): Song[] {
    this.version();
    return this.heap.topK(k);
  }

  play(id: string, amount = 100): void {
    const song = this.byId.get(id);
    if (!song) return;
    song.plays += amount;
    this.heap.heapify([...this.byId.values()]);
    this.touch();
  }


  select(id: string | null): void {
    this.selectedId.set(id);
  }

  recommend(id: string, maxDepth = 2): Recommendation[] {
    this.version();
    const reached = this.graph.bfs(id, maxDepth);
    return [...reached.entries()]
      .map(([songId, info]) => ({
        song: this.byId.get(songId)!,
        depth: info.depth,
        via: this.byId.get(info.via)!,
      }))
      .sort((a, b) => a.depth - b.depth || b.song.plays - a.song.plays);
  }

  neighbors(id: string): Song[] {
    this.version();
    return this.graph.neighbors(id).map((n) => this.byId.get(n)!);
  }

  connect(a: string, b: string): boolean {
    const ok = this.graph.addEdge(a, b);
    if (ok) this.touch();
    return ok;
  }

  disconnect(a: string, b: string): boolean {
    const ok = this.graph.removeEdge(a, b);
    if (ok) this.touch();
    return ok;
  }

  path(a: string, b: string): Song[] {
    this.version();
    return this.graph.shortestPath(a, b).map((id) => this.byId.get(id)!);
  }

  getSong(id: string): Song | undefined {
    return this.byId.get(id);
  }


  private register(song: Song): void {
    this.byId.set(song.id, song);
    this.trie.insert(song.title, song.id);
    this.heap.push(song);
    this.graph.addNode(song.id);
  }

  private touch(): void {
    this.version.update((v) => v + 1);
  }
}
