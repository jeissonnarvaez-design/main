export class MaxHeap<T> {
  private heap: T[] = [];

  /**
   * @param priority
   */
  constructor(
    private readonly priority: (item: T) => number,
    items: T[] = [],
  ) {
    if (items.length) this.heapify(items);
  }

  get size(): number {
    return this.heap.length;
  }

  isEmpty(): boolean {
    return this.heap.length === 0;
  }

  push(item: T): void {
    this.heap.push(item);
    this.percolateUp(this.heap.length - 1);
  }

  pop(): T | undefined {
    if (this.heap.length === 0) return undefined;
    const top = this.heap[0];
    const last = this.heap.pop()!;
    if (this.heap.length > 0) {
      this.heap[0] = last;
      this.percolateDown(0);
    }
    return top;
  }

  peek(): T | undefined {
    return this.heap[0];
  }

  heapify(items: T[]): void {
    this.heap = [...items];
    for (let i = Math.floor(this.heap.length / 2) - 1; i >= 0; i--) {
      this.percolateDown(i);
    }
  }

  topK(k: number): T[] {
    const copy = new MaxHeap<T>(this.priority);
    copy.heap = [...this.heap]; // ya cumple la propiedad de heap
    const result: T[] = [];
    while (result.length < k && !copy.isEmpty()) {
      result.push(copy.pop()!);
    }
    return result;
  }

  toArray(): T[] {
    return [...this.heap];
  }

  isValid(): boolean {
    for (let i = 0; i < this.heap.length; i++) {
      const l = 2 * i + 1;
      const r = 2 * i + 2;
      if (l < this.heap.length && this.p(l) > this.p(i)) return false;
      if (r < this.heap.length && this.p(r) > this.p(i)) return false;
    }
    return true;
  }

  private percolateUp(index: number): void {
    let i = index;
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.p(i) <= this.p(parent)) break;
      this.swap(i, parent);
      i = parent;
    }
  }

  private percolateDown(index: number): void {
    const n = this.heap.length;
    let i = index;
    while (true) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      let largest = i;
      if (left < n && this.p(left) > this.p(largest)) largest = left;
      if (right < n && this.p(right) > this.p(largest)) largest = right;
      if (largest === i) break;
      this.swap(i, largest);
      i = largest;
    }
  }

  private swap(a: number, b: number): void {
    [this.heap[a], this.heap[b]] = [this.heap[b], this.heap[a]];
  }

  private p(i: number): number {
    return this.priority(this.heap[i]);
  }
}
