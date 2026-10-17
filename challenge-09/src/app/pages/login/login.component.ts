import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="auth-container">
      <div class="card p-4 shadow">
        <h2 class="mb-4 text-center">Iniciar Sesión</h2>
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
        <button type="button" (click)="handleLogin()" class="btn btn-primary w-100">
          Ingresar
        </button>
        <p class="mt-3 text-center">
          ¿No tienes cuenta? <a routerLink="/register">Regístrate aquí</a>
        </p>
      </div>
    </div>
  `,
  styles: [`
    $primary-color: #3498db;

    .auth-container {
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #f8f9fa;

      .card {
        width: 100%;
        max-width: 400px;
        border-top: 4px solid $primary-color;
        border-radius: 8px;
      }
    }
  `]
})
export class LoginComponent {
  email = signal<string>('');
  password = signal<string>('');
  
  private authService = inject(AuthService);
  private router = inject(Router);

  async handleLogin() {
    try {
      await this.authService.login(this.email(), this.password());
      this.router.navigate(['/tasks']);
    } catch (error: any) {
      alert(error.message);
    }
  }
}