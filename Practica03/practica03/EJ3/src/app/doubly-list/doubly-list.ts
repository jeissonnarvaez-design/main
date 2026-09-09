import { Component, OnInit } from '@angular/core';
import { ListaPaginas, PageHistory, NodoPagina } from '../models/linked-list.model';

@Component({
  selector: 'app-doubly-list',
  standalone: true,
  templateUrl: './doubly-list.html',
  styleUrl: './doubly-list.css',
})

export class DoublyList implements OnInit {
  browserHistory = new ListaPaginas();
  currentPage: NodoPagina | null = null;

  ngOnInit(): void {
    const mockPages: PageHistory[] = [
      { url: 'https://www.example.com', titulo: 'Example' },
      { url: 'https://www.google.com', titulo: 'Google' },
      { url: 'https://www.github.com', titulo: 'GitHub' },
    ];

    mockPages.forEach(page => this.browserHistory.append(page));
    this.currentPage = this.browserHistory.head;
  }

  goBack(): void {
    if (this.currentPage && this.currentPage.prev) {
      this.currentPage = this.currentPage.prev;
    }
  }
  
  goForward(): void {
    if (this.currentPage && this.currentPage.next) {
      this.currentPage = this.currentPage.next;
    }
  }
}
