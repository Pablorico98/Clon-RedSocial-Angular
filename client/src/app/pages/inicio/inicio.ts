import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Router } from '@angular/router';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';



@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, PublicacionCardComponent],  
  templateUrl: './inicio.html'
})
export class Inicio implements OnInit {
  private authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);
  private router = inject(Router);

  // Estados con Signals
  publicaciones = signal<any[]>([]);
  ordenActual = signal<'fecha' | 'likes'>('fecha');
  isLoading = signal<boolean>(false);
  hasMore = signal<boolean>(true);  

  // Variables de paginación
  limit = 5;
  offset = 0;

  // Para saber quién soy y si puedo borrar una publicación
  usuarioActual: any = null;

  ngOnInit() {
    this.authService.usuario$.subscribe(user => {
      this.usuarioActual = user;
    });
    this.cargarPublicaciones(true);
  }

  cargarPublicaciones(reset: boolean = false) {
    if (reset) {
      this.offset = 0;
      this.publicaciones.set([]);
      this.hasMore.set(true);
    }

    if (!this.hasMore()) return;

    this.isLoading.set(true);

    this.publicacionesService.obtenerPublicaciones(this.limit, this.offset, this.ordenActual()).subscribe({
      next: (data: any[]) => {
        if (data.length < this.limit) {
          this.hasMore.set(false);
        }
        
        if (reset) {
          this.publicaciones.set(data);
        } else {
          this.publicaciones.update(pubs => [...pubs, ...data]);
        }
        
        this.offset += this.limit;
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error cargando publicaciones', err);
        this.isLoading.set(false);
      }
    });
  }

  cambiarOrden(nuevoOrden: 'fecha' | 'likes') {
    if (this.ordenActual() !== nuevoOrden) {
      this.ordenActual.set(nuevoOrden);
      this.cargarPublicaciones(true); 
    }
  }

  cargarMas() {
    this.cargarPublicaciones();
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

  onDarLike(id: string) {
    this.publicacionesService.darLike(id).subscribe({
      next: () => {
        this.publicaciones.update(pubs => pubs.map(p => {
          if (p._id === id) {
            p.likes.push(this.usuarioActual._id);
          }
          return p;
        }));
      }
    });
  }

  onQuitarLike(id: string) {
    this.publicacionesService.quitarLike(id).subscribe({
      next: () => {
        this.publicaciones.update(pubs => pubs.map(p => {
          if (p._id === id) {
            p.likes = p.likes.filter((userId: string) => userId !== this.usuarioActual._id);
          }
          return p;
        }));
      }
    });
  }

  onEliminarPub(id: string) {
    this.publicacionesService.eliminarPublicacion(id).subscribe({
      next: () => {
        this.publicaciones.update(pubs => pubs.filter(p => p._id !== id));
      }
    });
  }
}






