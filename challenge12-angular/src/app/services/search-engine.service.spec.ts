import { TestBed } from '@angular/core/testing';
import { MinHeap } from '../data-structures/min-heap';
import { Trie } from '../data-structures/trie';
import { SearchEngineService } from './search-engine.service';

describe('Trie', () => {
  it('busca palabras completas y por prefijo', () => {
    const trie = new Trie();
    trie.insert('air max', 90);
    trie.insert('air force', 95);

    expect(trie.search('air max')).toBe(true);
    expect(trie.search('air')).toBe(false);
    expect(trie.startsWith('air').map((p) => p.name).sort()).toEqual(['air force', 'air max']);
    expect(trie.startsWith('nike')).toEqual([]);
  });
});

describe('MinHeap', () => {
  it('heapify y pop devuelven en orden ascendente', () => {
    const heap = new MinHeap<number>([50, 30, 20, 15, 10, 8]);
    expect(heap.toArray()).toEqual([8, 10, 20, 15, 30, 50]);

    const out: number[] = [];
    while (heap.size() > 0) out.push(heap.pop()!);
    expect(out).toEqual([8, 10, 15, 20, 30, 50]);
  });
});

describe('SearchEngineService', () => {
  let engine: SearchEngineService;

  beforeEach(() => {
    engine = TestBed.inject(SearchEngineService);
    engine.insert('air max', 90);
    engine.insert('air force', 95);
    engine.insert('air jordan', 85);
    engine.insert('adidas boost', 80);
  });

  it('ejemplo del challenge: searchTopK("air", 2)', () => {
    expect(engine.searchTopK('air', 2)).toEqual([
      { name: 'air force', popularity: 95 },
      { name: 'air max', popularity: 90 },
    ]);
  });

  it('K mayor que los resultados devuelve todos ordenados', () => {
    expect(engine.searchTopK('a', 10).map((p) => p.name)).toEqual([
      'air force',
      'air max',
      'air jordan',
      'adidas boost',
    ]);
  });

  it('prefijo inexistente o K <= 0 devuelve []', () => {
    expect(engine.searchTopK('nike', 2)).toEqual([]);
    expect(engine.searchTopK('air', 0)).toEqual([]);
  });

  it('insertar un nombre existente actualiza su popularidad', () => {
    engine.insert('air jordan', 99);
    expect(engine.searchTopK('air', 1)).toEqual([{ name: 'air jordan', popularity: 99 }]);
  });
});
