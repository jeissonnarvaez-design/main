import { Graph } from './graph';

describe('Graph', () => {
  let g: Graph<{ id: string }>;
  beforeEach(() => {
    g = new Graph();
    ['a', 'b', 'c'].forEach((id) => g.addNode({ id }));
  });

  it('isEmpty', () => {
    expect(new Graph().isEmpty()).toBeTrue();
    expect(g.isEmpty()).toBeFalse();
  });

  it('addEdge es no dirigido', () => {
    g.addEdge('a', 'b');
    expect(g.adjacency['a']).toEqual(['b']);
    expect(g.adjacency['b']).toEqual(['a']);
    expect(g.addEdge('b', 'a')).toBeFalse();
  });

  it('removeNode borra sus aristas', () => {
    g.addEdge('a', 'b');
    g.addEdge('a', 'c');
    g.removeNode('a');
    expect(g.searchNode('a')).toBeNull();
    expect(g.adjacency['b']).toEqual([]);
    expect(g.edges()).toEqual([]);
  });
});
