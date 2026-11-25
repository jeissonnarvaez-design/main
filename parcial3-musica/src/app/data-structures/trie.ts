/**
 * TRIE (árbol de prefijos)
 * ------------------------------------------------------------
 * La información no vive en los nodos sino en el CAMINO:
 * cada arista representa un carácter y el recorrido desde la raíz
 * hasta un nodo forma el prefijo.
 *
 * Complejidad (m = longitud de la palabra):
 *   insert  -> O(m)
 *   search  -> O(m)
 *   suggestions(prefijo) -> O(p + k) donde p = largo del prefijo y
 *                           k = nº de nodos bajo ese prefijo.
 */

export class TrieNode {
  /** Hijos: clave = carácter, valor = siguiente nodo. */
  readonly children = new Map<string, TrieNode>();
  /** Marca que en este nodo termina una palabra completa. */
  isEndOfWord = false;
  /** Texto original (con mayúsculas/tildes) guardado al final de la palabra. */
  word: string | null = null;
  /** Ids de las canciones que tienen exactamente este título. */
  readonly ids = new Set<string>();
}

export interface TrieMatch {
  word: string;
  ids: string[];
}

export class Trie {
  /** La raíz no representa ningún carácter (nodo "nulo"). */
  private readonly root = new TrieNode();
  private wordCount = 0;
  private nodes = 1;

  /** Normaliza para que la búsqueda ignore mayúsculas, tildes y espacios extra. */
  static normalize(text: string): string {
    return text
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  /** Número de palabras distintas almacenadas. */
  get size(): number {
    return this.wordCount;
  }

  /** Número total de nodos (incluida la raíz). */
  get nodeCount(): number {
    return this.nodes;
  }

  isEmpty(): boolean {
    return this.wordCount === 0;
  }

  /**
   * Inserta una palabra. Reutiliza los nodos de los prefijos que ya existen
   * y crea solo los que faltan. Devuelve true si la palabra era nueva.
   */
  insert(word: string, id?: string): boolean {
    const key = Trie.normalize(word);
    if (!key) return false;

    let current = this.root;
    for (const char of key) {
      let next = current.children.get(char);
      if (!next) {
        next = new TrieNode();
        current.children.set(char, next);
        this.nodes++;
      }
      current = next;
    }

    const isNew = !current.isEndOfWord;
    if (isNew) {
      current.isEndOfWord = true;
      current.word = word.trim();
      this.wordCount++;
    }
    if (id) current.ids.add(id);
    return isNew;
  }

  /** ¿Existe exactamente esta palabra? */
  search(word: string): boolean {
    const node = this.findNode(Trie.normalize(word));
    return node !== null && node.isEndOfWord;
  }

  /** Devuelve la coincidencia exacta (título original + ids) o null. */
  get(word: string): TrieMatch | null {
    const node = this.findNode(Trie.normalize(word));
    if (!node || !node.isEndOfWord) return null;
    return { word: node.word ?? word, ids: [...node.ids] };
  }

  /** ¿Hay alguna palabra que empiece por este prefijo? */
  startsWith(prefix: string): boolean {
    return this.findNode(Trie.normalize(prefix)) !== null;
  }

  /**
   * Sugerencias por prefijo: baja hasta el nodo del prefijo y recorre
   * en profundidad (DFS) todo el subárbol, en orden alfabético.
   */
  suggestions(prefix: string, limit = Number.POSITIVE_INFINITY): TrieMatch[] {
    const key = Trie.normalize(prefix);
    const start = this.findNode(key);
    const result: TrieMatch[] = [];
    if (!start) return result;

    const dfs = (node: TrieNode): void => {
      if (result.length >= limit) return;
      if (node.isEndOfWord) {
        result.push({ word: node.word ?? '', ids: [...node.ids] });
      }
      const chars = [...node.children.keys()].sort((a, b) => a.localeCompare(b));
      for (const char of chars) {
        dfs(node.children.get(char)!);
        if (result.length >= limit) return;
      }
    };

    dfs(start);
    return result;
  }

  /** Lista todas las palabras guardadas. */
  words(): string[] {
    return this.suggestions('').map((m) => m.word);
  }

  /**
   * Elimina una palabra (o solo un id de ella). Poda los nodos que
   * quedan sin hijos y que no terminan otra palabra.
   */
  remove(word: string, id?: string): boolean {
    const chars = [...Trie.normalize(word)];
    const path: TrieNode[] = [this.root];
    let current = this.root;
    for (const char of chars) {
      const next = current.children.get(char);
      if (!next) return false;
      path.push(next);
      current = next;
    }
    if (!current.isEndOfWord) return false;

    if (id) {
      current.ids.delete(id);
      if (current.ids.size > 0) return true; // aún hay otras canciones con ese título
    }

    current.isEndOfWord = false;
    current.word = null;
    current.ids.clear();
    this.wordCount--;

    // Poda de abajo hacia arriba
    for (let i = chars.length; i > 0; i--) {
      const node = path[i];
      if (node.isEndOfWord || node.children.size > 0) break;
      path[i - 1].children.delete(chars[i - 1]);
      this.nodes--;
    }
    return true;
  }

  private findNode(key: string): TrieNode | null {
    let current = this.root;
    for (const char of key) {
      const next = current.children.get(char);
      if (!next) return null;
      current = next;
    }
    return current;
  }
}
