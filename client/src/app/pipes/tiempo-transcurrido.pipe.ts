import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tiempoTranscurrido', standalone: true, pure: true })
export class TiempoTranscurridoPipe implements PipeTransform {
  transform(value: string | Date): string {
    if (!value) return '';
    const ahora = Date.now();
    const fecha = new Date(value).getTime();
    const diff = Math.floor((ahora - fecha) / 1000);

    if (diff < 60) return 'hace un momento';
    if (diff < 3600) return `hace ${Math.floor(diff / 60)} min`;
    if (diff < 86400) return `hace ${Math.floor(diff / 3600)} h`;
    if (diff < 2592000) return `hace ${Math.floor(diff / 86400)} días`;
    if (diff < 31536000) return `hace ${Math.floor(diff / 2592000)} meses`;
    return `hace ${Math.floor(diff / 31536000)} años`;
  }
}
