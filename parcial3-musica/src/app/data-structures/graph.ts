export class UndirectedGraph {
  private readonly adjacency = new Map<string, Set<string>>();

  get size(): number {
    return this.adjacency.size;
  }

  get edgeCount(): number {
    let total = 0;
    for (const neighbors of this.adjacency.values()) total += neighbors.size;
    return total / 2;
  }

  isEmpty(): boolean {
    return this.adjacency.size === 0;
  }

  addNode(id: string): boolean {
    if (this.adjacency.has(id)) return false;
    this.adjacency.set(id, new Set());
    return true;
  }

  hasNode(id: string): boolean {
    return this.adjacency.has(id);
  }

  removeNode(id: string): boolean {
    const neighbors = this.adjacency.get(id);
    if (!neighbors) return false;
    for (const n of neighbors) this.adjacency.get(n)?.delete(id);
    this.adjacency.delete(id);
    return true;
  }

  addEdge(a: string, b: string): boolean {
    if (a === b) return false;
    if (!this.hasNode(a) || !this.hasNode(b)) return false;
    if (this.hasEdge(a, b)) return false;
    this.adjacency.get(a)!.add(b);
    this.adjacency.get(b)!.add(a);
    return true;
  }

  removeEdge(a: string, b: string): boolean {
    if (!this.hasEdge(a, b)) return false;
    this.adjacency.get(a)!.delete(b);
    this.adjacency.get(b)!.delete(a);
    return true;
  }

  hasEdge(a: string, b: string): boolean {
    return this.adjacency.get(a)?.has(b) ?? false;
  }

  neighbors(id: string): string[] {
    return [...(this.adjacency.get(id) ?? [])];
  }

  degree(id: string): number {
    return this.adjacency.get(id)?.size ?? 0;
  }

  nodes(): string[] {
    return [...this.adjacency.keys()];
  }

  edges(): [string, string][] {
    const seen = new Set<string>();
    const result: [string, string][] = [];
    for (const [a, neighbors] of this.adjacency) {
      for (const b of neighbors) {
        const key = a < b ? `${a}|${b}` : `${b}|${a}`;
        if (!seen.has(key)) {
          seen.add(key);
          result.push([a, b]);
        }
      }
    }
    return result;
  }


  bfs(start: string, maxDepth = Number.POSITIVE_INFINITY): Map<string, { depth: number; via: string }> {
    const result = new Map<string, { depth: number; via: string }>();
    if (!this.hasNode(start)) return result;

    const visited = new Set<string>([start]);
    const queue: { id: string; depth: number }[] = [{ id: start, depth: 0 }];
    let head = 0;

    while (head < queue.length) {
      const { id, depth } = queue[head++];
      if (depth >= maxDepth) continue;
      for (const n of this.adjacency.get(id)!) {
        if (visited.has(n)) continue;
        visited.add(n);
        result.set(n, { depth: depth + 1, via: id });
        queue.push({ id: n, depth: depth + 1 });
      }
    }
    return result;
  }

  shortestPath(from: string, to: string): string[] {
    if (!this.hasNode(from) || !this.hasNode(to)) return [];
    if (from === to) return [from];
    const reached = this.bfs(from);
    if (!reached.has(to)) return [];
    const path = [to];
    let current = to;
    while (current !== from) {
      current = reached.get(current)!.via;
      path.unshift(current);
    }
    return path;
  }
}
