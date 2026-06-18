import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'truncate', standalone: true, pure: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limite: number = 100): string {
    if (!value || value.length <= limite) return value;
    return value.slice(0, limite).trimEnd() + '…';
  }
}
