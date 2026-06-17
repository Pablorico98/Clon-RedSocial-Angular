import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, Subscription, interval } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private router = inject(Router);

  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  // --- SIGNALS PARA EL MODAL DE SESIÓN ---
  mostrarModal = signal<boolean>(false);
  tiempoRestante = signal<number>(300); // 5 minutos en segundos

  private sessionTimeout: any;
  private countdownSub: Subscription | null = null;

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((usuario: any) => {
        this.usuarioSubject.next(usuario);
        this.iniciarTemporizadorSesion(); 
      })
    );
  }

  registro(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, userData).pipe(
      tap((usuario: any) => {
        this.usuarioSubject.next(usuario);
        this.iniciarTemporizadorSesion(); 
      })
    );
  }

  autorizar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/autorizar`, {}).pipe(
      tap((user: any) => {
        this.usuarioSubject.next(user);
        this.iniciarTemporizadorSesion(); 
      })
    );
  }

  
  refrescar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/refrescar`, {}).pipe(
      tap(() => {
        this.ocultarModal();
        this.iniciarTemporizadorSesion(); 
      })
    );
  }

  isAuthenticated(): boolean {
    return this.usuarioSubject.getValue() !== null;
  }

  limpiarSesion(): void {
    this.usuarioSubject.next(null);
    this.detenerTemporizadores();
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => {
        this.limpiarSesion();
        this.ocultarModal();
      })
    );
  }


  private iniciarTemporizadorSesion() {
    this.detenerTemporizadores(); 
    const tiempoParaAviso = 5 * 60 * 1000; // poner en 5000 para pruebas

    this.sessionTimeout = setTimeout(() => {
      this.mostrarModalAviso();
    }, tiempoParaAviso);
  }

  private mostrarModalAviso() {
    this.mostrarModal.set(true);
    this.tiempoRestante.set(300); // Setea en 300 segundos (5 min)

    
    this.countdownSub = interval(1000).subscribe(() => {
      const current = this.tiempoRestante();
      if (current > 0) {
        this.tiempoRestante.set(current - 1);
      } else {
    
        this.logout().subscribe({
          next: () => this.router.navigate(['/login']),
          error: () => {
            this.limpiarSesion();
            this.router.navigate(['/login']);
          }
        });
      }
    });
  }

  ocultarModal() {
    this.mostrarModal.set(false);
    if (this.countdownSub) {
      this.countdownSub.unsubscribe();
    }
  }

  private detenerTemporizadores() {
    if (this.sessionTimeout) clearTimeout(this.sessionTimeout);
    if (this.countdownSub) this.countdownSub.unsubscribe();
    this.mostrarModal.set(false);
  }
}