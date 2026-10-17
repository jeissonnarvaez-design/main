import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card p-4 shadow">
        <h2 class="mb-4 text-center">Crear Cuenta</h2>
        <div class="mb-3">
          <input 
            type="email" 
            placeholder="Correo electrónico" 
            [ngModel]="email()" 
            (ngModelChange)="email.set($event)" 
            class="form-control" 
          />
        </div>
        <div class="mb-3">
          <input 
            type="password" 
            placeholder="Contraseña" 
            [ngModel]="password()" 
            (ngModelChange)="password.set($event)" 
            class="form-control" 
          />
        </div>
        <button type="button" (click)="handleRegister()" class="btn btn-success w-100">
          Registrarse
        </button>
        <p class="mt-3 text-center">
          ¿Ya tienes una cuenta? <a routerLink="/login">Inicia sesión</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    $success-color: #2ecc71;

    .auth-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f9fa;

      .card {
        width: 100%;
        max-width: 400px;
        border-top: 4px solid $success-color;
        border-radius: 8px;
      }
    }
  `]
})
export class RegisterComponent {
  email = signal<string>('');
  password = signal<string>('');

  private authService = inject(AuthService);
  private router = inject(Router);

  async handleRegister() {
    try {
      await this.authService.register(this.email(), this.password());
      this.router.navigate(['/tasks']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}