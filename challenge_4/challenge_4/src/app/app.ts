import { Component, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from './books/books';
import { Stack } from './stack/stack';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  bookStack = new Stack();
  displayedStack = signal<Book[]>([]);

  // Agregamos esta propiedad para solucionar el error
  totalBooks = computed(() => this.displayedStack().length);

  bookForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.bookForm = this.fb.group({
      name: ['', Validators.required],
      isbn: ['', Validators.required],
      author: ['', Validators.required],
      editorial: ['', Validators.required]
    });

    this.fillMockData();
  }

  fillMockData(): void {
    const mockBooks: Book[] = [
      { name: 'Cien Años de Soledad', isbn: '978-0307474728', author: 'Gabriel García Márquez', editorial: 'Sudamericana' },
      { name: 'Don Quijote de la Mancha', isbn: '978-8424116316', author: 'Miguel de Cervantes', editorial: 'Espasa' },
      { name: 'El Principito', isbn: '978-0156013987', author: 'Antoine de Saint-Exupéry', editorial: 'Reynal & Hitchcock' }
    ];

    mockBooks.forEach(book => this.bookStack.push(book));
    this.updateStackView();
  }

  addBook(): void {
    if (this.bookForm.valid) {
      const newBook: Book = this.bookForm.value;
      this.bookStack.push(newBook);
      this.updateStackView();
      this.bookForm.reset();
    }
  }

  removeBook(): void {
    const popped = this.bookStack.pop();
    if (popped) {
      this.updateStackView();
    }
  }

  private updateStackView(): void {
    this.displayedStack.set(this.bookStack.getItems() as Book[]);
  }
}