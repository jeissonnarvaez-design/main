import { UndirectedGraph } from './graph';

describe('UndirectedGraph', () => {
  let g: UndirectedGraph;

  beforeEach(() => {
    g = new UndirectedGraph();
    ['a', 'b', 'c', 'd', 'e'].forEach((n) => g.addNode(n));
    g.addEdge('a', 'b');
    g.addEdge('b', 'c');
    g.addEdge('c', 'd');
  });

  it('las aristas son bidireccionales', () => {
    expect(g.hasEdge('a', 'b')).toBe(true);
    expect(g.hasEdge('b', 'a')).toBe(true);
    expect(g.edgeCount).toBe(3);
  });

  it('no permite lazos ni aristas repetidas', () => {
    expect(g.addEdge('a', 'a')).toBe(false);
    expect(g.addEdge('b', 'a')).toBe(false);
    expect(g.edgeCount).toBe(3);
  });

  it('BFS devuelve distancias', () => {
    const r = g.bfs('a', 2);
    expect(r.get('b')?.depth).toBe(1);
    expect(r.get('c')?.depth).toBe(2);
    expect(r.has('d')).toBe(false);
    expect(r.has('a')).toBe(false);
  });

  it('encuentra el camino más corto', () => {
    expect(g.shortestPath('a', 'd')).toEqual(['a', 'b', 'c', 'd']);
    expect(g.shortestPath('a', 'e')).toEqual([]);
  });

  it('removeNode elimina también sus aristas', () => {
    g.removeNode('b');
    expect(g.neighbors('a')).toEqual([]);
    expect(g.neighbors('c')).toEqual(['d']);
    expect(g.edgeCount).toBe(1);
  });
});
