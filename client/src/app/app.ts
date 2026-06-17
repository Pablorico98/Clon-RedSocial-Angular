import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.html'
})
export class App {
  authService = inject(AuthService);

  get mostrarModal() {
    return this.authService.mostrarModal();
  }

  get tiempoFormateado() {
    const t = this.authService.tiempoRestante();
    const minutos = Math.floor(t / 60).toString().padStart(2, '0');
    const segundos = (t % 60).toString().padStart(2, '0');
    return `${minutos}:${segundos}`;
  }

  extenderSesion() {
    this.authService.refrescar().subscribe({
      error: () => this.cerrarSesion()
    });
  }

  cerrarSesion() {
    this.authService.logout().subscribe({
      next: () => window.location.href = '/login',
      error: () => window.location.href = '/login'
    });
  }
}