export class Node {
  constructor (
  public value: string,
  public next: Node | null = null) {}
}

export class CircularList {
  public head: Node | null = null;
  public tail: Node | null = null;
  public length: number = 0;

  append(value: string) {
    const newNode = new Node(value);
    if (!this.head) {
      this.head = newNode;
      this.tail = newNode;
      newNode.next = this.head;
    } else {
      this.tail!.next = newNode;
      this.tail = newNode;
      this.tail.next = this.head;
    }
    this.length++;
  }
}