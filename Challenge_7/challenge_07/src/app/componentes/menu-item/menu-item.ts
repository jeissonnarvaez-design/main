import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuNode } from '../../modelos/menu-node/menu-node';

@Component({
  selector: 'app-menu-item',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './menu-item.html',
  styleUrls: ['./menu-item.css']
})
export class MenuItemComponent {
  @Input() nodo!: MenuNode;
  @Input() nivel: number = 0;

  expandido: boolean = false;

  toggle(): void {
    this.expandido = !this.expandido;
  }
}