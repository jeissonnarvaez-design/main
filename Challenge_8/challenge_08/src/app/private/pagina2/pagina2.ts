import { Component, inject } from '@angular/core';
import { Auth } from '../../auth';

@Component({
  selector: 'app-pagina2',
  templateUrl: './pagina2.html',
  styleUrl: './pagina2.css'
})
export class Pagina2 {
  protected readonly auth = inject(Auth);
}