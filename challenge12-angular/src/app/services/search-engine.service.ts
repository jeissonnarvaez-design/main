import { Injectable, signal } from '@angular/core';
import { MinHeap } from '../data-structures/min-heap';
import { Product } from '../data-structures/product';
import { Trie } from '../data-structures/trie';

const byPopularity = (a: Product, b: Product): number =>
  a.popularity !== b.popularity ? a.popularity - b.popularity : b.name.localeCompare(a.name);

@Injectable({ providedIn: 'root' })
export class SearchEngineService {
  private trie = new Trie();

  readonly products = signal<Product[]>([]);

  insert(name: string, popularity: number): void {
    const clean = name.trim();
    if (!clean) return;

    this.trie.insert(clean, popularity);
    this.products.set(this.trie.startsWith(''));
  }

  search(word: string): boolean {
    return this.trie.search(word);
  }

  searchTopK(prefix: string, k: number): Product[] {
    if (k <= 0) return [];

    const candidates = this.trie.startsWith(prefix);
    const heap = new MinHeap<Product>([], byPopularity);

    for (const product of candidates) {
      heap.push(product);
      if (heap.size() > k) {
        heap.pop(); 
      }
    }

    const result: Product[] = [];
    while (heap.size() > 0) {
      result.push(heap.pop()!);
    }
    return result.reverse(); 
  }
}
