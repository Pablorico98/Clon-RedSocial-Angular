import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, PublicacionCardComponent, RouterModule, ReactiveFormsModule],
  templateUrl: './inicio.html'
})
export class Inicio implements OnInit {
  private authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);
  private router = inject(Router);
  private fb = inject(FormBuilder);

  public publicaciones = signal<any[]>([]);
  public  ordenActual = signal<'fecha' | 'likes'>('fecha');
  public isLoading = signal<boolean>(false);
  public hasMore = signal<boolean>(true);
  public isSubmitting = signal<boolean>(false);
  
  limit = 5;
  offset = 0;
  usuarioActual: any = null;

  // Formulario de Creación
  publicacionForm: FormGroup;
  imagenFile: File | null = null;

  constructor() {
    this.publicacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.maxLength(100)]],
      mensaje: ['', [Validators.required, Validators.maxLength(500)]]
    });
  }

  ngOnInit() {
    this.authService.usuario$.subscribe(user => {
      this.usuarioActual = user;
    });
    this.cargarPublicaciones(true);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenFile = input.files[0];
    }
  }

onCrearPublicacion() {
    if (this.publicacionForm.invalid) return;

    this.isSubmitting.set(true);
    const formData = new FormData();
    formData.append('titulo', this.publicacionForm.get('titulo')?.value);
    formData.append('mensaje', this.publicacionForm.get('mensaje')?.value);
    if (this.imagenFile) formData.append('imagen', this.imagenFile);

    this.publicacionesService.crearPublicacion(formData).subscribe({
      next: () => {
        this.publicacionForm.reset();
        this.imagenFile = null;
        this.isSubmitting.set(false);
        if (this.ordenActual() !== 'fecha') {
          this.cambiarOrden('fecha');
        } else {
          this.cargarPublicaciones(true); 
        }
      },
      error: (err) => {
        console.error('Error al crear publicación', err);
        this.isSubmitting.set(false);
      }
    });
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
        if (data.length < this.limit) this.hasMore.set(false);
        if (reset) this.publicaciones.set(data);
        else this.publicaciones.update(pubs => [...pubs, ...data]);
        this.offset += this.limit;
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  cambiarOrden(nuevoOrden: 'fecha' | 'likes') {
    if (this.ordenActual() !== nuevoOrden) {
      this.ordenActual.set(nuevoOrden);
      this.cargarPublicaciones(true);
    }
  }

  cargarMas() { this.cargarPublicaciones(); }

  onLogout() {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }

  onDarLike(id: string) {
    this.publicacionesService.darLike(id).subscribe(() => {
      this.publicaciones.update(pubs => pubs.map(p => {
        if (p._id === id) p.likes.push(this.usuarioActual._id);
        return p;
      }));
    });
  }

  onQuitarLike(id: string) {
    this.publicacionesService.quitarLike(id).subscribe(() => {
      this.publicaciones.update(pubs => pubs.map(p => {
        if (p._id === id) p.likes = p.likes.filter((userId: string) => userId !== this.usuarioActual._id);
        return p;
      }));
    });
  }

  onEliminarPub(id: string) {
    this.publicacionesService.eliminarPublicacion(id).subscribe(() => {
      this.publicaciones.update(pubs => pubs.filter(p => p._id !== id));
    });
  }
}