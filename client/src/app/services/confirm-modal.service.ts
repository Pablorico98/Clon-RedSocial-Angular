import { Injectable, signal } from '@angular/core';

export interface ConfirmOpciones {
  titulo: string;
  mensaje: string;
  textoConfirmar?: string;
  textoCancelar?: string;
  peligro?: boolean;
}

@Injectable({ providedIn: 'root' })
export class ConfirmModalService {
  visible = signal(false);
  opciones = signal<ConfirmOpciones>({ titulo: '', mensaje: '' });

  private resolver?: (valor: boolean) => void;

  abrir(opciones: ConfirmOpciones): Promise<boolean> {
    this.opciones.set(opciones);
    this.visible.set(true);
    return new Promise(resolve => { this.resolver = resolve; });
  }

  confirmar() {
    this.visible.set(false);
    this.resolver?.(true);
  }

  cancelar() {
    this.visible.set(false);
    this.resolver?.(false);
  }
}
