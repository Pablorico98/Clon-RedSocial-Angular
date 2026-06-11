import { Component, inject } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, AsyncPipe],
  templateUrl: './perfil.html'
})
export class Perfil {
  authService = inject(AuthService);
  private router = inject(Router);

  onLogout() {
    this.authService.logout().subscribe({
      next: () => this.router.navigate(['/login']),
      error: () => {
        this.authService.limpiarSesion();
        this.router.navigate(['/login']);
      }
    });
  }
}
