import { Directive } from '@angular/core';

@Directive({
  selector: '[appSoloNumeros]',
  standalone: true,
  host: {
    '(keydown)': 'onKeyDown($event)',
  },
})
export class SoloNumerosDirective {
  onKeyDown(event: KeyboardEvent) {
    const permitidas = ['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete', 'Enter'];
    if (permitidas.includes(event.key)) return;
    if (!/^\d$/.test(event.key)) {
      event.preventDefault();
    }
  }
}
