import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { UsuariosService } from '../../../services/usuarios.service';
import { AutoFocusDirective } from '../../../directives/auto-focus.directive';
import { ResaltarDirective } from '../../../directives/resaltar.directive';
import { InicialesPipe } from '../../../pipes/iniciales.pipe';

@Component({
  selector: 'app-dashboard-usuarios',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, AutoFocusDirective, ResaltarDirective, InicialesPipe],
  templateUrl: './usuarios.html',
})
export class DashboardUsuarios implements OnInit {
  private usuariosService = inject(UsuariosService);
  private fb = inject(FormBuilder);

  usuarios = signal<any[]>([]);
  cargando = signal(true);
  errorCarga = signal('');
  mostrarFormulario = signal(false);
  enviando = signal(false);
  error = signal('');

  form: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    apellido: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    nombreUsuario: ['', Validators.required],
    password: ['', [Validators.required, Validators.minLength(8)]],
    fechaNacimiento: ['', Validators.required],
    descripcionBreve: [''],
    perfil: ['usuario', Validators.required],
  });

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.errorCarga.set('');
    this.usuariosService.listar().subscribe({
      next: (data) => { this.usuarios.set(data); this.cargando.set(false); },
      error: (err) => {
        this.errorCarga.set(err?.status === 403 ? 'Sin permisos (403). ¿Reiniciaste sesión como admin?' : `Error ${err?.status ?? ''} al cargar usuarios`);
        this.cargando.set(false);
      },
    });
  }

  crearUsuario() {
    if (this.form.invalid) return;
    this.enviando.set(true);
    this.error.set('');
    this.usuariosService.crear(this.form.value).subscribe({
      next: (nuevo) => {
        this.usuarios.update(lista => [nuevo, ...lista]);
        this.form.reset({ perfil: 'usuario' });
        this.mostrarFormulario.set(false);
        this.enviando.set(false);
      },
      error: (err) => {
        this.error.set(err?.error?.message ?? 'Error al crear usuario');
        this.enviando.set(false);
      },
    });
  }

  deshabilitar(id: string) {
    this.usuariosService.deshabilitar(id).subscribe({
      next: () => this.usuarios.update(lista => lista.map(u => u._id === id ? { ...u, activo: false } : u)),
    });
  }

  habilitar(id: string) {
    this.usuariosService.habilitar(id).subscribe({
      next: () => this.usuarios.update(lista => lista.map(u => u._id === id ? { ...u, activo: true } : u)),
    });
  }
}
