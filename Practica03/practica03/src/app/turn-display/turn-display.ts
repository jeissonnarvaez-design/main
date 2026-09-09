import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-turn-display',
  standalone: true,
  templateUrl: './turn-display.html',
  styleUrl: './turn-display.css',
})
export class TurnDisplay {
  @Input() currentTurn: string = 'No hay turnos activos';
}
