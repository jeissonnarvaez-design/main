import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { MusicService } from './services/music.service';
import { SongSearch } from './components/song-search/song-search';
import { AddSong } from './components/add-song/add-song';
import { Ranking } from './components/ranking/ranking';
import { Recommendations } from './components/recommendations/recommendations';

@Component({
  selector: 'app-root',
  imports: [DecimalPipe, SongSearch, AddSong, Ranking, Recommendations],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly stats = inject(MusicService).stats;
}
