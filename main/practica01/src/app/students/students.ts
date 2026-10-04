import { Component, EventEmitter, Input, Output} from '@angular/core';
import { student } from '../linked-list/linked-list';

@Component({
  selector: 'app-students',
  standalone: true,
  imports: [],
  templateUrl: './students.html',
  styleUrl: './students.css',
})
export class StudentListComponent {
  @Input() students: student[] = [];

  @Output() removeStudent = new EventEmitter<string>();

  onDelete(code: string): void {
    this.removeStudent.emit(code);
  }
}
