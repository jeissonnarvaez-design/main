import { Component, inject } from '@angular/core';
import { Auth } from '../../auth';

@Component({
  selector: 'app-pagina1',
  templateUrl: './pagina1.html',
  styleUrl: './pagina1.css'
})
export class Pagina1 {
  protected readonly auth = inject(Auth);
}