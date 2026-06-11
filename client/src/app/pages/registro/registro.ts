import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './registro.html',
})
export class RegistroComponent {
  registroForm: FormGroup;
  selectedFile: File | null = null;
  isSubmitting: boolean = false;

  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registroForm = this.fb.group({
      nombreUsuario: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required]]
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  clearFile() {
    this.selectedFile = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  onRegistro() {
    if (this.registroForm.valid) {
      this.isSubmitting = true;
      const formData = new FormData();

      Object.keys(this.registroForm.controls).forEach(key => {
        formData.append(key, this.registroForm.get(key)?.value);
      });

      if (this.selectedFile) {
        formData.append('imagenPerfil', this.selectedFile);
      }

      this.authService.registro(formData).subscribe({
        next: () => {
          alert('¡Registro exitoso!');
          this.router.navigate(['/login']);
        },
        error: (err) => {
          this.isSubmitting = false;
          alert('Error: ' + (err.error.message || 'Error en el registro'));
        }
      });
    }
  }
}