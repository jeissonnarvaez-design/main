export interface Identifiable {
  id: string;
}

export interface Edge {
  source: string;
  target: string;
}

export class Graph<T extends Identifiable> {
  nodes: T[] = [];
  adjacency: Record<string, string[]> = {};

  addNode(node: T): T {
    if (this.searchNode(node.id)) {
      throw new Error(`Ya existe el nodo "${node.id}"`);
    }
    this.nodes.push(node);
    this.adjacency[node.id] = [];
    return node;
  }

  searchNode(id: string): T | null {
    return this.nodes.find((n) => n.id === id) ?? null;
  }

  addEdge(idA: string, idB: string): boolean {
    if (idA === idB) throw new Error('No se puede unir un nodo consigo mismo');
    if (!this.searchNode(idA) || !this.searchNode(idB)) {
      throw new Error(`No existe "${idA}" o "${idB}"`);
    }
    if (this.adjacency[idA].includes(idB)) return false;
    this.adjacency[idA].push(idB);
    this.adjacency[idB].push(idA);
    return true;
  }

  removeEdge(idA: string, idB: string): boolean {
    if (!this.adjacency[idA] || !this.adjacency[idB]) return false;
    this.adjacency[idA] = this.adjacency[idA].filter((id) => id !== idB);
    this.adjacency[idB] = this.adjacency[idB].filter((id) => id !== idA);
    return true;
  }

  printAdjacency(id: string): T[] {
    return (this.adjacency[id] ?? []).map((v) => this.searchNode(v)!);
  }

  isEmpty(): boolean {
    return this.nodes.length === 0;
  }

  removeNode(id: string): boolean {
    if (!this.searchNode(id)) return false;
    for (const vecino of this.adjacency[id]) {
      this.adjacency[vecino] = this.adjacency[vecino].filter((v) => v !== id);
    }
    delete this.adjacency[id];
    this.nodes = this.nodes.filter((n) => n.id !== id);
    return true;
  }

  print(label: (n: T) => string = (n) => n.id, neighborLabel: (n: T) => string = label): string {
    const text = this.nodes
      .map((n) => `${label(n)} -> [${this.printAdjacency(n.id).map(neighborLabel).join(', ')}]`)
      .join('\n');
    console.log(text);
    return text;
  }

  edges(): Edge[] {
    const result: Edge[] = [];
    for (const [a, vecinos] of Object.entries(this.adjacency)) {
      for (const b of vecinos) if (a < b) result.push({ source: a, target: b });
    }
    return result;
  }
}
