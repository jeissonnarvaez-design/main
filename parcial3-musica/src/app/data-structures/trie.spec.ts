import { Trie } from './trie';

describe('Trie', () => {
  let trie: Trie;

  beforeEach(() => {
    trie = new Trie();
    ['Bad Guy', 'Bichota', 'Blinding Lights', 'Bohemian Rhapsody', 'Despacito'].forEach((w, i) =>
      trie.insert(w, `s${i}`),
    );
  });

  it('inserta canciones y cuenta palabras', () => {
    expect(trie.size).toBe(5);
    expect(trie.insert('Despacito')).toBe(false); // repetida
    expect(trie.size).toBe(5);
  });

  it('busca canciones exactas sin importar mayúsculas ni tildes', () => {
    expect(trie.search('despacito')).toBe(true);
    expect(trie.search('BAD GUY')).toBe(true);
    expect(trie.search('Bad')).toBe(false); // es prefijo, no palabra
    trie.insert('Dákiti');
    expect(trie.search('dakiti')).toBe(true);
  });

  it('sugiere por prefijo en orden alfabético', () => {
    expect(trie.suggestions('b').map((m) => m.word)).toEqual([
      'Bad Guy',
      'Bichota',
      'Blinding Lights',
      'Bohemian Rhapsody',
    ]);
    expect(trie.suggestions('bl').map((m) => m.word)).toEqual(['Blinding Lights']);
    expect(trie.suggestions('xyz')).toEqual([]);
    expect(trie.suggestions('b', 2).length).toBe(2);
  });

  it('reutiliza nodos de prefijos compartidos', () => {
    const t = new Trie();
    t.insert('abc');
    const before = t.nodeCount;
    t.insert('abd');
    expect(t.nodeCount).toBe(before + 1);
  });

  it('elimina palabras y poda nodos', () => {
    const t = new Trie();
    t.insert('ab');
    t.insert('abc');
    expect(t.remove('abc')).toBe(true);
    expect(t.search('abc')).toBe(false);
    expect(t.search('ab')).toBe(true);
    expect(t.nodeCount).toBe(3);
  });
});
