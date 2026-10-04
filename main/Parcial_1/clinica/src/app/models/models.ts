//Lista enlazada simple

export class NodeSingly<T> {
  constructor(public value: T, public next: NodeSingly<T> | null = null) {}
}

export class Gestion<T> {
  head: NodeSingly<T> | null = null;
  tail: NodeSingly<T> | null = null;
  length: number = 0;

  append(value: T): void {
    const newNode = new NodeSingly(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) this.tail.next = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  remove(): T | null {
    if (!this.head) return null;
    const removedValue = this.head.value;
    this.head = this.head.next;
    if (!this.head) this.tail = null;
    this.length--;
    return removedValue;
  }
}


//Lista doblemente enlazada

export class NodeDoubly<T> {
  constructor(
    public value: T,
    public next: NodeDoubly<T> | null = null,
    public prev: NodeDoubly<T> | null = null
  ) {}
}

export class Historial<T> {
  head: NodeDoubly<T> | null = null;
  tail: NodeDoubly<T> | null = null;
  length: number = 0;

  append(value: T): void {
    const newNode = new NodeDoubly(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      this.tail = newNode;
    }
    this.length++;
  }
}

//Lista circular simple

export class NodeCircular<T> {
  constructor(public value: T, public next: NodeCircular<T> | null = null) {}
}

export class Rotacion<T> {
  head: NodeCircular<T> | null = null;
  tail: NodeCircular<T> | null = null;
  current: NodeCircular<T> | null = null;
  length: number = 0;

  append(value: T): void {
    const newNode = new NodeCircular(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
      this.current = this.head;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.next = this.head;
      this.tail = newNode;
    }
    this.length++;
  }

  rotateNext(): T | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.value;
    }
    return null;
  }
}

//Lista circular doblemente enlazada

export class NodeDoublyCircular<T> {
  constructor(
    public value: T,
    public next: NodeDoublyCircular<T> | null = null,
    public prev: NodeDoublyCircular<T> | null = null
  ) {}
}

export class Comite<T> {
  head: NodeDoublyCircular<T> | null = null;
  tail: NodeDoublyCircular<T> | null = null;
  current: NodeDoublyCircular<T> | null = null;
  length: number = 0;

  append(value: T): void {
    const newNode = new NodeDoublyCircular(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
      newNode.prev = this.head;
      this.current = this.head;
    } else if (this.tail) {
      this.tail.next = newNode;
      newNode.prev = this.tail;
      newNode.next = this.head;
      this.head.prev = newNode;
      this.tail = newNode;
    }
    this.length++;
  }

  nextMember(): T | null {
    if (this.current && this.current.next) {
      this.current = this.current.next;
      return this.current.value;
    }
    return null;
  }

  prevMember(): T | null {
    if (this.current && this.current.prev) {
      this.current = this.current.prev;
      return this.current.value;
    }
    return null;
  }
}