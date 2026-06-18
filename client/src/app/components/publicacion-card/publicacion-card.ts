import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { TiempoTranscurridoPipe } from '../../pipes/tiempo-transcurrido.pipe';
import { ConfirmModalService } from '../../services/confirm-modal.service';

@Component({
  selector: 'app-publicacion-card',
  standalone: true,
  imports: [CommonModule, RouterModule, TruncatePipe, TiempoTranscurridoPipe],
  templateUrl: './publicacion-card.html'
})
export class PublicacionCardComponent {
  private confirmModal = inject(ConfirmModalService);
  private router = inject(Router);

  @Input() publicacion!: any;
  @Input() usuarioActualId: string | null = null;
  @Input() perfilUsuario: string | null = null;
  @Input() truncar: boolean = true;

  @Output() darLike = new EventEmitter<string>();
  @Output() quitarLike = new EventEmitter<string>();
  @Output() eliminar = new EventEmitter<string>();

  get meGusta() {
    return this.usuarioActualId && this.publicacion.likes?.includes(this.usuarioActualId);
  }

  irAlDetalle() {
    this.router.navigate(['/publicacion', this.publicacion._id], {
      state: { publicacionData: this.publicacion },
    });
  }

  toggleLike() {
    if (this.meGusta) {
      this.quitarLike.emit(this.publicacion._id);
    } else {
      this.darLike.emit(this.publicacion._id);
    }
  }

  async onEliminar() {
    const ok = await this.confirmModal.abrir({
      titulo: 'Eliminar publicación',
      mensaje: '¿Estás seguro? Esta acción no se puede deshacer.',
      textoConfirmar: 'Eliminar',
      peligro: true,
    });
    if (ok) this.eliminar.emit(this.publicacion._id);
  }
}