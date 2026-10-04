import { Component, Input } from '@angular/core';

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

@Component({
  selector: 'app-product',
  standalone: true,
  templateUrl: './product.html',
  styleUrl: './product.css',
})

export class ProductComponent {
  @Input({required:true}) product!: Product;
}
