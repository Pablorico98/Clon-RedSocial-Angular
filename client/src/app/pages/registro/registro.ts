import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './registro.html',
})
export class RegistroComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal<boolean>(false);
  errorMessage = signal<string | null>(null);
  
  registroForm: FormGroup;
  imagenFile: File | null = null;

  constructor() {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(8), this.passwordValidator]],
      repetirPassword: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.maxLength(150)]] 
    }, {
      validators: this.matchPasswordsValidator
    });
  }

  private passwordValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value || '';
    const hasUpperCase = /[A-Z]/.test(value);
    const hasNumber = /[0-9]/.test(value);
    if (!hasUpperCase || !hasNumber) return { passwordComplexity: true };
    return null;
  }

  private matchPasswordsValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const repetirPassword = group.get('repetirPassword')?.value;
    if (password !== repetirPassword) {
      group.get('repetirPassword')?.setErrors({ passwordsMismatch: true });
      return { passwordsMismatch: true };
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.imagenFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formData = new FormData();
    Object.keys(this.registroForm.value).forEach(key => {
      formData.append(key, this.registroForm.value[key]);
    });

    if (this.imagenFile) {
      formData.append('imagenPerfil', this.imagenFile);
    }

    this.authService.registro(formData).subscribe({
      next: () => {
        this.isLoading.set(false);
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading.set(false);
        const errMsg = Array.isArray(err.error?.message) 
          ? err.error.message.join(' | ') 
          : (err.error?.message || 'Ocurrió un error al registrar el usuario.');
        this.errorMessage.set(errMsg);
      }
    });
  }
}