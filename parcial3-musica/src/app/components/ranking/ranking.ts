import { Component, computed, inject, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MusicService } from '../../services/music.service';
import { Song } from '../../models/song';

@Component({
  selector: 'app-ranking',
  imports: [DecimalPipe],
  templateUrl: './ranking.html',
  styleUrl: './ranking.scss',
})
export class Ranking {
  private readonly music = inject(MusicService);

  protected readonly options = [3, 5, 10];
  protected readonly k = signal(5);
  protected readonly showHeap = signal(false);
  protected readonly selectedId = this.music.selectedId;

  protected readonly top = computed(() => this.music.topK(this.k()));
  protected readonly max = computed(() => this.top()[0]?.plays ?? 1);

  protected readonly levels = computed(() => {
    const arr = this.music.heapArray();
    const levels: { index: number; song: Song }[][] = [];
    for (let start = 0, size = 1; start < arr.length; start += size, size *= 2) {
      levels.push(arr.slice(start, start + size).map((song, i) => ({ index: start + i, song })));
    }
    return levels;
  });

  protected play(id: string): void {
    this.music.play(id, 500);
  }

  protected select(id: string): void {
    this.music.select(id);
  }
}
