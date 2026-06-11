import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;
  private usuarioSubject = new BehaviorSubject<any>(null);
  usuario$ = this.usuarioSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((usuario: any) => this.usuarioSubject.next(usuario))
    );
  }

  registro(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/registro`, userData);
  }

  autorizar(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/autorizar`, {}).pipe(
      tap((user: any) => this.usuarioSubject.next(user))
    );
  }

  isAuthenticated(): boolean {
    return this.usuarioSubject.getValue() !== null;
  }

  limpiarSesion(): void {
    this.usuarioSubject.next(null);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/logout`, {}).pipe(
      tap(() => this.usuarioSubject.next(null))
    );
  }
}