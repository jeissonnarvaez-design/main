import { Product } from './product';

export class TrieNode {
  isEndOfWord = false;
  children: Record<string, TrieNode> = {};
  product: Product | null = null;

  constructor(public value: string | null) {}
}

export class Trie {
  root = new TrieNode(null);

  insert(name: string, popularity: number): void {
    let current = this.root;

    for (const character of name.toLowerCase()) {
      if (current.children[character] === undefined) {
        current.children[character] = new TrieNode(character);
      }
      current = current.children[character];
    }

    current.isEndOfWord = true;
    current.product = { name, popularity };
  }

  search(word: string): boolean {
    const node = this.findNode(word);
    return node !== null && node.isEndOfWord;
  }

  findNode(prefix: string): TrieNode | null {
    let current = this.root;
    for (const character of prefix.toLowerCase()) {
      if (current.children[character] === undefined) {
        return null;
      }
      current = current.children[character];
    }
    return current;
  }

  startsWith(prefix: string): Product[] {
    const results: Product[] = [];
    const start = this.findNode(prefix);
    if (start === null) return results;

    const stack: TrieNode[] = [start];
    while (stack.length > 0) {
      const node = stack.pop()!;
      if (node.isEndOfWord && node.product) results.push(node.product);
      for (const character in node.children) {
        stack.push(node.children[character]);
      }
    }
    return results;
  }
}
