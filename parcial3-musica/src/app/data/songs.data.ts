import { Song } from '../models/song';

export const SEED_SONGS: Song[] = [
  // Pop
  { id: 's1', title: 'Blinding Lights', artist: 'The Weeknd', genre: 'pop', plays: 9800 },
  { id: 's2', title: 'Shape of You', artist: 'Ed Sheeran', genre: 'pop', plays: 9400 },
  { id: 's3', title: 'Levitating', artist: 'Dua Lipa', genre: 'pop', plays: 7600 },
  { id: 's4', title: 'As It Was', artist: 'Harry Styles', genre: 'pop', plays: 8100 },
  { id: 's5', title: 'Bad Guy', artist: 'Billie Eilish', genre: 'pop', plays: 7200 },
  // Reggaetón
  { id: 's6', title: 'Despacito', artist: 'Luis Fonsi', genre: 'reggaeton', plays: 9100 },
  { id: 's7', title: 'Tusa', artist: 'Karol G', genre: 'reggaeton', plays: 7900 },
  { id: 's8', title: 'Bichota', artist: 'Karol G', genre: 'reggaeton', plays: 6800 },
  { id: 's9', title: 'Dákiti', artist: 'Bad Bunny', genre: 'reggaeton', plays: 8300 },
  { id: 's10', title: 'Pepas', artist: 'Farruko', genre: 'reggaeton', plays: 6100 },
  // Rock
  { id: 's11', title: 'Bohemian Rhapsody', artist: 'Queen', genre: 'rock', plays: 8700 },
  { id: 's12', title: 'Back in Black', artist: 'AC/DC', genre: 'rock', plays: 5900 },
  { id: 's13', title: 'Smells Like Teen Spirit', artist: 'Nirvana', genre: 'rock', plays: 6400 },
  { id: 's14', title: 'De Música Ligera', artist: 'Soda Stereo', genre: 'rock', plays: 5600 },
  // Salsa
  { id: 's15', title: 'Vivir Mi Vida', artist: 'Marc Anthony', genre: 'salsa', plays: 6900 },
  { id: 's16', title: 'La Rebelión', artist: 'Joe Arroyo', genre: 'salsa', plays: 5300 },
  { id: 's17', title: 'Cali Pachanguero', artist: 'Grupo Niche', genre: 'salsa', plays: 5800 },
  // Electrónica
  { id: 's18', title: 'Titanium', artist: 'David Guetta', genre: 'electronica', plays: 7000 },
  { id: 's19', title: 'Wake Me Up', artist: 'Avicii', genre: 'electronica', plays: 7400 },
  { id: 's20', title: 'Animals', artist: 'Martin Garrix', genre: 'electronica', plays: 5100 },
];

export const SEED_RELATIONS: [string, string][] = [
  // dentro del pop
  ['s1', 's4'], ['s1', 's3'], ['s2', 's3'], ['s4', 's5'], ['s2', 's5'],
  // dentro del reggaetón
  ['s6', 's9'], ['s7', 's8'], ['s7', 's9'], ['s9', 's10'], ['s6', 's10'],
  // dentro del rock
  ['s11', 's12'], ['s12', 's13'], ['s13', 's14'], ['s11', 's14'],
  // dentro de la salsa
  ['s15', 's16'], ['s16', 's17'], ['s15', 's17'],
  // dentro de la electrónica
  ['s18', 's19'], ['s19', 's20'], ['s18', 's20'],
  // puentes entre géneros
  ['s1', 's19'], ['s3', 's18'], ['s2', 's6'], ['s5', 's13'],
  ['s6', 's15'], ['s14', 's7'], ['s10', 's20'],
];
