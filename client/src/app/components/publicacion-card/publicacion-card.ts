import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './publicacion-card.html'
})
export class PublicacionCardComponent {
  @Input() publicacion!: any;
  @Input() usuarioActualId: string | null = null;

  @Output() darLike = new EventEmitter<string>();
  @Output() quitarLike = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  get meGusta() {
    return this.usuarioActualId && this.publicacion.likes?.includes(this.usuarioActualId);
  }

  toggleLike() {
    if (this.meGusta) {
      this.quitarLike.emit(this.publicacion._id);
    } else {
      this.darLike.emit(this.publicacion._id);
    }
  }

  onEliminar() {
    if (confirm('¿Estás seguro de que deseas eliminar esta publicación?')) {
      this.eliminar.emit(this.publicacion._id);
    }
  }
}