import { MaxHeap } from './max-heap';

describe('MaxHeap', () => {
  const id = (n: number) => n;

  it('push mantiene el máximo en la raíz', () => {
    const h = new MaxHeap<number>(id);
    [5, 1, 9, 3, 7].forEach((n) => h.push(n));
    expect(h.peek()).toBe(9);
    expect(h.size).toBe(5);
    expect(h.isValid()).toBe(true);
  });

  it('pop devuelve los elementos de mayor a menor', () => {
    const h = new MaxHeap<number>(id, [4, 10, 3, 5, 1, 8]);
    const out: number[] = [];
    while (!h.isEmpty()) out.push(h.pop()!);
    expect(out).toEqual([10, 8, 5, 4, 3, 1]);
    expect(h.pop()).toBeUndefined();
  });

  it('heapify construye un heap válido', () => {
    const h = new MaxHeap<number>(id);
    h.heapify([3, 1, 6, 5, 2, 4]);
    expect(h.isValid()).toBe(true);
    expect(h.peek()).toBe(6);
  });

  it('topK no modifica el heap original', () => {
    const h = new MaxHeap<{ p: number }>((x) => x.p, [{ p: 2 }, { p: 9 }, { p: 5 }, { p: 7 }]);
    expect(h.topK(2).map((x) => x.p)).toEqual([9, 7]);
    expect(h.size).toBe(4);
    expect(h.topK(10).length).toBe(4);
  });
});
