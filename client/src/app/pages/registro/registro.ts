import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink], // Importamos lo necesario
  templateUrl: './registro.html'
})
export class Registro {
  registroForm: FormGroup;
  archivoSeleccionado: File | null = null;

  constructor(private fb: FormBuilder) {
    this.registroForm = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      nombreUsuario: ['', Validators.required],
      // Regex para: Mínimo 8 caracteres, al menos 1 letra mayúscula y 1 número
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Z])(?=.*\d).+$/)]],
      repetirPassword: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      descripcionBreve: ['']  
    }, { validators: this.passwordsCoinciden });
  }

  // Validador personalizado para chequear que las dos contraseñas sean iguales
  passwordsCoinciden(formGroup: FormGroup) {
    const password = formGroup.get('password')?.value;
    const repetirPassword = formGroup.get('repetirPassword')?.value;
    return password === repetirPassword ? null : { noCoinciden: true };
  }

  // Esta función atrapa la foto cuando el usuario la elige en el input type="file"
  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.archivoSeleccionado = event.target.files[0];
    }
  }

  onSubmit() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched(); // Marca todos los campos para que se pongan en rojo si hay error
      return;
    }

    console.log('Datos del formulario:', this.registroForm.value);
    console.log('Imagen capturada:', this.archivoSeleccionado);
    
     
  }
}