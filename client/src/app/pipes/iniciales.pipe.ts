import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'iniciales', standalone: true, pure: true })
export class InicialesPipe implements PipeTransform {
  transform(nombreCompleto: string): string {
    if (!nombreCompleto) return '';
    return nombreCompleto
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(p => p[0].toUpperCase())
      .join('');
  }
}
