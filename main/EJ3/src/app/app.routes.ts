import { Routes } from '@angular/router';
import { SinglyListComponent } from './singly-list/singly-list';
import { DoublyList } from './doubly-list/doubly-list';

export const routes: Routes = [
  { path: 'singly', component: SinglyListComponent },
  { path: 'doubly', component: DoublyList },
  { path: '', redirectTo: 'singly', pathMatch: 'full' },
  { path: '**', redirectTo: 'singly' }
];