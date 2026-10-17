import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService, Task } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestor de Tareas</h2>
        <button class="btn btn-danger" (click)="logout()">Cerrar Sesión</button>
      </div>

      <!-- Formulario para agregar tarea -->
      <div class="card p-3 mb-4 shadow-sm">
        <h5>Nueva Tarea</h5>
        <div class="mb-2">
          <input 
            type="text" 
            placeholder="Título" 
            [ngModel]="newTitle()" 
            (ngModelChange)="newTitle.set($event)" 
            class="form-control" 
          />
        </div>
        <div class="mb-2">
          <input 
            type="text" 
            placeholder="Descripción" 
            [ngModel]="newDesc()" 
            (ngModelChange)="newDesc.set($event)" 
            class="form-control" 
          />
        </div>
        <button class="btn btn-success" (click)="addTask()">Crear Tarea</button>
      </div>

      <!-- Estado de carga -->
      @if (taskService.isPending()) {
        <p class="text-center text-muted">Cargando tareas...</p>
      }

      <!-- Listado de Tareas -->
      <div class="list-group">
        @for (task of taskService.results(); track task.id) {
          <div class="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <h5 [class.text-decoration-line-through]="task.completed" [class.text-muted]="task.completed">
                {{ task.title }}
              </h5>
              <p class="mb-1 text-muted">{{ task.description }}</p>
            </div>
            <div>
              <button 
                class="btn btn-sm me-2" 
                [ngClass]="task.completed ? 'btn-secondary' : 'btn-outline-success'" 
                (click)="toggleComplete(task)">
                {{ task.completed ? 'Completada' : 'Pendiente' }}
              </button>
              <button class="btn btn-sm btn-danger" (click)="deleteTask(task.id)">Eliminar</button>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 700px;

      .list-group-item {
        transition: all 0.2s ease-in-out;
        &:hover {
          background-color: #f8f9fa;
        }
      }
    }
  `]
})
export class TasksComponent implements OnInit {
  taskService = inject(TaskService);
  private authService = inject(AuthService);
  private router = inject(Router);

  newTitle = signal<string>('');
  newDesc = signal<string>('');

  ngOnInit() {
    this.taskService.getAll();
  }

  async addTask() {
    if (!this.newTitle().trim()) return;
    await this.taskService.add({
      title: this.newTitle(),
      description: this.newDesc(),
      completed: false
    });
    this.newTitle.set('');
    this.newDesc.set('');
  }

  async toggleComplete(task: Task) {
    if (task.id) {
      await this.taskService.update(task.id, { completed: !task.completed });
    }
  }

  async deleteTask(id?: string) {
    if (id) {
      await this.taskService.remove(id);
    }
  }

  async logout() {
    await this.authService.logout();
    this.router.navigate(['/login']);
  }
}