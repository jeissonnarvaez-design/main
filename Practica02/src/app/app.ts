import { Component, signal } from '@angular/core';
import { CarouselComponent } from './carousel/carousel';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CarouselComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('Practica02');
}
