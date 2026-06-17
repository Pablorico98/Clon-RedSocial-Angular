import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Router, RouterModule } from '@angular/router';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, RouterModule, PublicacionCardComponent],
  templateUrl: './perfil.html'
})
export class Perfil implements OnInit {
  private authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);
  private router = inject(Router);

  usuarioActual = signal<any>(null);
  misPublicaciones = signal<any[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit() {
    // Escuchamos quién es el usuario logueado
    this.authService.usuario$.subscribe(user => {
      if (user) {
        this.usuarioActual.set(user);
        this.cargarMisUltimasPublicaciones(user._id);
      }
    });
  }

  cargarMisUltimasPublicaciones(userId: string) {
    this.isLoading.set(true);
    // Pedimos: 3 publicaciones, offset 0, orden por fecha, y filtradas por mi userId
    this.publicacionesService.obtenerPublicaciones(3, 0, 'fecha', userId).subscribe({
      next: (data) => {
        this.misPublicaciones.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando mis publicaciones', err);
        this.isLoading.set(false);
      }
    });
  }

  // --- Lógica de Interacciones (igual que en Inicio) ---
  onDarLike(id: string) {
    this.publicacionesService.darLike(id).subscribe({
      next: () => {
        this.misPublicaciones.update(pubs => pubs.map(p => {
          if (p._id === id) p.likes.push(this.usuarioActual()._id);
          return p;
        }));
      }
    });
  }

  onQuitarLike(id: string) {
    this.publicacionesService.quitarLike(id).subscribe({
      next: () => {
        this.misPublicaciones.update(pubs => pubs.map(p => {
          if (p._id === id) p.likes = p.likes.filter((uId: string) => uId !== this.usuarioActual()._id);
          return p;
        }));
      }
    });
  }

  onEliminarPub(id: string) {
    this.publicacionesService.eliminarPublicacion(id).subscribe({
      next: () => {
        this.misPublicaciones.update(pubs => pubs.filter(p => p._id !== id));
      }
    });
  }

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