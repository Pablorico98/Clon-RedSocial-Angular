import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EstadisticasService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  private params(desde: string, hasta: string): HttpParams {
    let p = new HttpParams();
    if (desde) p = p.set('desde', desde);
    if (hasta) p = p.set('hasta', hasta);
    return p;
  }

  publicacionesPorUsuario(desde: string, hasta: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/publicaciones-por-usuario`, { params: this.params(desde, hasta) });
  }

  comentariosPorTiempo(desde: string, hasta: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/comentarios-por-tiempo`, { params: this.params(desde, hasta) });
  }

  comentariosPorPublicacion(desde: string, hasta: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/estadisticas/comentarios-por-publicacion`, { params: this.params(desde, hasta) });
  }
}
