export type Genre = 'pop' | 'reggaeton' | 'rock' | 'salsa' | 'electronica';

export const GENRES: { value: Genre; label: string }[] = [
  { value: 'pop', label: 'Pop' },
  { value: 'reggaeton', label: 'Reggaetón' },
  { value: 'rock', label: 'Rock' },
  { value: 'salsa', label: 'Salsa' },
  { value: 'electronica', label: 'Electrónica' },
];

export interface Song {
  id: string;
  title: string;
  artist: string;
  genre: Genre;
  plays: number;
}

export interface Recommendation {
  song: Song;
  depth: number;
  via: Song;
}
