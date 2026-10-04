import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MenuNode } from '../../modelos/menu-node/menu-node';
import { MenuTreeService } from '../../modelos/menu-arbol/menu-arbol';
import { MenuItemComponent } from '../menu-item/menu-item';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, MenuItemComponent],
  templateUrl: './sidebar.html',
  styleUrls: ['./sidebar.css']
})
export class SidebarComponent implements OnInit {
  raiz!: MenuNode;

  constructor(private menuTreeService: MenuTreeService) {}

  ngOnInit(): void {
    this.raiz = this.menuTreeService.construirArbol();

    console.log('--- DFS ---');
    this.menuTreeService.dfs(this.raiz);
    console.log('--- BFS ---');
    this.menuTreeService.bfs(this.raiz);
  }
}