import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators , FormControl} from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { PublicacionesService } from '../../services/publicaciones.service';
import { PublicacionCardComponent } from '../../components/publicacion-card/publicacion-card';

@Component({
  selector: 'app-publicacion-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, PublicacionCardComponent],
  templateUrl: './publicacion-detalle.html'
})
export class PublicacionDetalleComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private authService = inject(AuthService);
  private publicacionesService = inject(PublicacionesService);
  private fb = inject(FormBuilder);

  publicacion = signal<any>(null);
  comentarios = signal<any[]>([]);
  usuarioActual = signal<any>(null);
  comentarioEditandoId = signal<string | null>(null);
  
  isLoading = signal<boolean>(true);
  hasMore = signal<boolean>(true);
  limit = 5; 
  page = 1;
  pubId: string = '';
  editControl = new FormControl('', [Validators.required, Validators.maxLength(250)]);
  comentarioForm: FormGroup;

  constructor() {
    this.comentarioForm = this.fb.group({
      mensaje: ['', [Validators.required, Validators.maxLength(250)]]
    });
  }

  ngOnInit() {
    this.authService.usuario$.subscribe(user => this.usuarioActual.set(user));
    this.pubId = this.route.snapshot.paramMap.get('id') || '';
    const state = history.state;    
    
    if (state && state.publicacionData) {
      this.publicacion.set(state.publicacionData);
      this.cargarComentarios(true);
    } else {
      this.router.navigate(['/inicio']);
    }
  }

  cargarComentarios(reset: boolean = false) {
    if (reset) {
      this.page = 1; 
      this.comentarios.set([]);
      this.hasMore.set(true);
    }

    if (!this.hasMore()) return;

    this.publicacionesService.obtenerComentarios(this.pubId, this.page, this.limit).subscribe({
      next: (data: any[]) => {
        if (data.length < this.limit) {
          this.hasMore.set(false); 
        }
        
        if (reset) {
          this.comentarios.set(data);
        } else {
          this.comentarios.update(coms => [...coms, ...data]);  
        }
        
        this.page++; 
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false)
    });
  }

  cargarMas() {
    this.cargarComentarios();
  }

  onDarLike(id: string) {
    this.publicacionesService.darLike(id).subscribe({
      next: () => {
        const pub = this.publicacion();
        if (pub && pub._id === id) {
          pub.likes.push(this.usuarioActual()._id);
          this.publicacion.set({...pub});
        }
      }
    });
  }

  onQuitarLike(id: string) {
    this.publicacionesService.quitarLike(id).subscribe({
      next: () => {
        const pub = this.publicacion();
        if (pub && pub._id === id) {
          pub.likes = pub.likes.filter((userId: string) => userId !== this.usuarioActual()._id);
          this.publicacion.set({...pub});
        }
      }
    });
  }

  onEliminarPub(id: string) {
    this.publicacionesService.eliminarPublicacion(id).subscribe({
      next: () => this.router.navigate(['/inicio'])
    });
  }

  onAgregarComentario() {
    if (this.comentarioForm.invalid) return;

    const mensaje = this.comentarioForm.get('mensaje')?.value;
    
    this.publicacionesService.agregarComentario(this.pubId, mensaje).subscribe({
      next: (nuevoComentario) => {
        this.comentarioForm.reset();
        this.cargarComentarios(true);  
        const pub = this.publicacion();
        if (pub) {
          pub.cantidadComentarios = (pub.cantidadComentarios || 0) + 1;
          this.publicacion.set({...pub});
        }
      },
      error: (err) => console.error('Error al agregar comentario', err)
    });
  }

  // --- MÉTODOS DE EDICIÓN ---
  iniciarEdicion(comentario: any) {
    this.comentarioEditandoId.set(comentario._id);
    this.editControl.setValue(comentario.texto);
  }

  cancelarEdicion() {
    this.comentarioEditandoId.set(null);
    this.editControl.reset();
  }

  guardarEdicion(comentarioId: string) {
    if (this.editControl.invalid) return;

    const nuevoTexto = this.editControl.value;
    
    this.publicacionesService.editarComentario(this.pubId, comentarioId, nuevoTexto!).subscribe({
      next: () => {
        this.comentarioEditandoId.set(null);
        
        this.comentarios.update(coms => coms.map(c => {
          if (c._id === comentarioId) {
            c.texto = nuevoTexto;
            c.modificado = true; 
          }
          return c;
        }));
      },
      error: (err) => console.error('Error al editar comentario', err)
    });
  }
}