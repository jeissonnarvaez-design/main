import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { Product, ProductComponent } from '../product/product';
import { doublyLinkedCircularList, Node } from '../circular-linked/circular-linked';

@Component({
  selector: 'app-carousel',
  imports: [ProductComponent],
  standalone: true,
  templateUrl: './carousel.html',
  styleUrl: './carousel.css',
})
export class CarouselComponent implements OnInit, OnDestroy {
public productsList = new doublyLinkedCircularList<Product>();

currentNode = signal<Node<Product> | null>(null);

private autoPlayInterval: any;

  ngOnInit(): void {
    this.productsList.append({ id: 1, name: 'Producto 1', price: 10.99, image: 'https://via.placeholder.com/150' });
    this.productsList.append({ id: 2, name: 'Producto 2', price: 19.99, image: 'https://via.placeholder.com/150' });
    this.productsList.append({ id: 3, name: 'Producto 3', price: 5.99, image: 'https://via.placeholder.com/150' });
    
    this.currentNode.set(this.productsList.head);
    this.startAutoPlay();
  }

  nextProduct(): void {
    const current = this.currentNode();
    if (current && current.next) {
      this.currentNode.set(current.next);
    }
    this.resetAutoPlay();
  }

  previousProduct(): void {
    const current = this.currentNode();
    if (current && current.prev) {
      this.currentNode.set(current.prev);
    }
    this.resetAutoPlay();
  }

  startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextProduct();
    }, 3000);
  }

  resetAutoPlay(): void {
    clearInterval(this.autoPlayInterval);
    this.startAutoPlay();
  }
  ngOnDestroy(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
    }
  }
}
