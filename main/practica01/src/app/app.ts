import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { student, LinkedList } from './linked-list/linked-list';
import { StudentListComponent } from './students/students';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ StudentListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private studentsList: LinkedList = new LinkedList();
  private students: student[] = [];
  public studentsListSignal = signal<student[]>([]);

  public nameInput: string = '';
  public ageInput: number = 0
  public codeInput: string = '';

  addStudent(): void {
  if (!this.nameInput || !this.ageInput || !this.codeInput)return; 

    const newStudent: student = {
      name: this.nameInput,
      age: Number(this.ageInput),
      code: this.codeInput
    };

    this.studentsList.append(newStudent);
    this.students.push(newStudent);
    this.updateSignal();
    this.nameInput = '';
    this.ageInput = 0;
    this.codeInput = '';
  }

  deleteStudent(code: string): void {
    this.studentsList.remove(code);
    this.students = this.students.filter(currentStudent => currentStudent.code !== code);
    this.updateSignal();
  }

  private updateSignal(): void {
    this.studentsListSignal.set(this.linkedListToArray());
  }

  private linkedListToArray(): student[] {
    return [...this.students];
  }
}
