//doubly linked-circular list

export class Node<T> {
  value: T;
  next: Node<T> | null;
  prev: Node<T> | null;

  constructor(value: T) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

  export class doublyLinkedCircularList<T> {
    head: Node<T> | null = null;
    tail: Node<T> | null = null;
    private length: number = 0;

    append(value: T): void {
      const newNode = new Node(value);
      if (!this.head) {
        this.head = newNode;
        this.tail = newNode;
        newNode.next = newNode;
        newNode.prev = newNode;
      } else {
        newNode.prev = this.tail;
        newNode.next = this.head;
        if (this.tail) this.tail.next = newNode;
        if (this.head) this.head.prev = newNode;
        this.tail = newNode;
      }
      this.length++;
    }

    size(): number {
      return this.length;
    }
  }