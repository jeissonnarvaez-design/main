export interface student {
  name: string;
  age: number
  code: string;
}

export class Node {
  value: student;
  next: Node | null = null;
  prev: Node | null = null;

  constructor(value: student) {
    this.value = value;
    this.next = null;
  }
}

export class LinkedList {
  head: Node | null = null;
  tail: Node | null = null;
  length: number = 0;

  append(student: student): void {
    const newNode = new Node(student);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
    } else {
      if (this.tail) {
        this.tail.next = newNode;
        newNode.prev = this.tail;
        this.tail = newNode;
      }
    }
    this.length++;
  }

  remove(code: string): void {
    let current = this.head;

    while (current) {
      if (current.value.code === code) {
        if (current.prev) {
          current.prev.next = current.next;
        } else {
          this.head = current.next;
        }

        if (current.next) {
          current.next.prev = current.prev;
        } else {
          this.tail = current.prev;
        }

        this.length--;
        return;
      }
      current = current.next;
    }
  }
}