import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      identificador: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]]
    });
  }

  // Botón de ingreso rápido (para desarrollo)
  fillData() {
    this.loginForm.patchValue({
      identificador: 'pablo@utn.edu.ar', // Reemplaza con tu cuenta de test
      password: '12345678'      // Reemplaza con tu password de test
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/inicio']),
        error: (err) => console.error('Error de login:', err)
      });
    }
  }
}