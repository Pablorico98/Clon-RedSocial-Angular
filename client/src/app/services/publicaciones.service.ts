import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PublicacionesService {
  private http = inject(HttpClient);
  private apiUrl = environment?.apiUrl || 'http://localhost:3000'; 

  obtenerPublicaciones(limit: number = 10, offset: number = 0, orden: 'fecha' | 'likes' = 'fecha'): Observable<any> {
    const params = new HttpParams()
      .set('limit', limit)
      .set('offset', offset)
      .set('orden', orden);
    
    return this.http.get(`${this.apiUrl}/publicaciones`, { params });
  }

  darLike(id: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/publicaciones/${id}/like`, {});
  }

  quitarLike(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/publicaciones/${id}/like`);
  }

  eliminarPublicacion(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/publicaciones/${id}`);
  }
}