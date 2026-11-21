import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private auth = inject(AuthService);
  private router = inject(Router);

  email = '';
  clave = '';
  msg = signal('');
  error = signal(false);
  cargando = signal(false);

  async entrar() {
    this.cargando.set(true);
    const { error } = await this.auth.entrar(this.email, this.clave);
    this.cargando.set(false);
    if (error) {
      this.error.set(true);
      this.msg.set(error.message);
    } else {
      this.router.navigate(['/tareas']);
    }
  }

  async registrar() {
    if (!this.email || this.clave.length < 6) {
      this.error.set(true);
      this.msg.set('Ingresa un correo y una contraseña de al menos 6 caracteres');
      return;
    }
    this.cargando.set(true);
    const { data, error } = await this.auth.registrar(this.email, this.clave);
    this.cargando.set(false);
    this.error.set(!!error);
    if (error) {
      this.msg.set(error.message);
    } else if (data.session) {
      this.router.navigate(['/tareas']);
    } else {
      this.msg.set('Revisa tu correo para confirmar la cuenta');
    }
  }
}
