import { Component, signal } from '@angular/core';
import { CircularList, Node } from './circular-list/circular-list';
import { TurnDisplay } from './turn-display/turn-display';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [TurnDisplay],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private turnList = new CircularList();

  protected currentNode = signal<Node | null>(null);
  protected totalTurns = signal<number>(0);

  constructor() {
    this.turnList.append('Turno 1');
    this.turnList.append('Turno 2');
    this.turnList.append('Turno 3');

    if (this.turnList.head) {
      this.currentNode.set(this.turnList.head);
      this.totalTurns.set(this.turnList.length);
    }
  }

  addNewTurn(turnName: string) {
    if (!turnName.trim()) return;
      this.turnList.append(turnName);
      this.totalTurns.set(this.turnList.length);

      if (this.turnList.length === 1 && this.turnList.head) {
        this.currentNode.set(this.turnList.head);
    }
  }

  nextTurn() {
    const current = this.currentNode();
    if (current && current.next) {
      this.currentNode.set(current.next);
    }
  }
}
