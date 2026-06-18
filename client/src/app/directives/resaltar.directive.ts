import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[appResaltar]',
  standalone: true,
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()',
  },
})
export class ResaltarDirective {
  private elemento = inject(ElementRef);
  color = input('#dbeafe');

  onMouseEnter() {
    this.elemento.nativeElement.style.backgroundColor = this.color();
  }

  onMouseLeave() {
    this.elemento.nativeElement.style.backgroundColor = '';
  }
}
