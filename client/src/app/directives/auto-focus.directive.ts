import { Directive, ElementRef, inject, OnInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements OnInit {
  private elemento = inject(ElementRef);

  ngOnInit() {
    setTimeout(() => this.elemento.nativeElement.focus(), 0);
  }
}
