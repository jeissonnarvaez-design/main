import { Component, OnInit }  from '@angular/core';
import { ListaCanciones, Cancion, NodoCancion } from '../models/linked-list.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-singly-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './singly-list.html',
  styleUrls: ['./singly-list.css']
})

export class SinglyListComponent implements OnInit {
  playlist = new ListaCanciones();
  currentTrack: NodoCancion | null = null;

  ngOnInit(): void {
   const mockSongs: Cancion[] = [
      { id: 1, titulo: 'Bohemian Rhapsody', artista: 'Queen', duracion: '5:55' },
      { id: 2, titulo: 'Hotel California', artista: 'Eagles', duracion: '6:30' },
      { id: 3, titulo: 'Billie Jean', artista: 'Michael Jackson', duracion: '4:20' },
    ];

    mockSongs.forEach(song => this.playlist.append(song));
    this.currentTrack = this.playlist.head;
  }

  nextTrack(): void {
    if (this.currentTrack && this.currentTrack.next) {
      this.currentTrack = this.currentTrack.next;
    }
  }

  reiniciarLista(): void {
    this.currentTrack = this.playlist.head;
  }
}

