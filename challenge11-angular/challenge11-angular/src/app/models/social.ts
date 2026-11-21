export interface City {
  id: string;
  type: 'city';
  name: string;
}

export interface Person {
  id: string;
  type: 'person';
  name: string;
  age: number;
  city: string;
}

export type SocialNode = Person | City;

export function slug(prefix: 'city' | 'person', name: string): string {
  return (
    prefix + ':' +
    name.trim().toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .replace(/\s+/g, '-')
  );
}

export function nodeLabel(n: SocialNode): string {
  return n.type === 'person' ? `${n.name} (${n.age})` : `[Ciudad] ${n.name}`;
}
