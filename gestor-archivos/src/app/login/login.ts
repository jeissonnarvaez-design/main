import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class LoginComponent {
  email = '';
  password = '';
  
  private authService = inject(AuthService);
  private router = inject(Router);

  async entrar() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos.');
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      this.router.navigate(['/gestor']);
    } catch (error: any) {
      alert('Error al iniciar sesión: ' + error.message);
    }
  }

  async registrar() {
    if (!this.email || !this.password) {
      alert('Por favor, completa todos los campos para registrarte.');
      return;
    }

    try {
      await this.authService.registrar(this.email, this.password);
      alert('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
    } catch (error: any) {
      alert('Error al registrar: ' + error.message);
    }
  }
}