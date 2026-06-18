import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class UsuariosService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`);
  }

  crear(dto: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios`, dto);
  }

  deshabilitar(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/usuarios/${id}`);
  }

  habilitar(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuarios/${id}/habilitar`, {});
  }
}
