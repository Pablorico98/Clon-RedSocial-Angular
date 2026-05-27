import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html'
})
export class Login {
  loginForm: FormGroup;
  private router = inject(Router); // Inyectamos el enrutador para poder navegar

  constructor(private fb: FormBuilder) {
    this.loginForm = this.fb.group({
      identificador: ['', Validators.required],
      password: ['', [
        Validators.required, 
        Validators.minLength(8), 
        Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)
      ]]
    });
  }

  // Función exclusiva para testing
  autocompletarDatos() {
    this.loginForm.patchValue({
      identificador: 'pablo@test.com', // Ya queda cargado tu mail
      password: 'Password123'          // Y tu contraseña
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched(); 
      return;
    }

    console.log('Simulando login exitoso con:', this.loginForm.value);
    
    // Como esto es un mockup temporal, navegamos directamente al Inicio
    this.router.navigate(['/inicio']);
  }
}