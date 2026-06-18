import { Component, inject, signal, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Chart, registerables } from 'chart.js';
import { EstadisticasService } from '../../../services/estadisticas.service';

Chart.register(...registerables);

@Component({
  selector: 'app-dashboard-estadisticas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './estadisticas.html',
})
export class DashboardEstadisticas implements AfterViewInit, OnDestroy {
  private estadisticasService = inject(EstadisticasService);

  @ViewChild('barCanvas') barCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('lineCanvas') lineCanvas!: ElementRef<HTMLCanvasElement>;
  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  desde = signal('');
  hasta = signal('');
  cargando = signal(false);

  private barChart?: Chart;
  private lineChart?: Chart;
  private pieChart?: Chart;

  ngAfterViewInit() {
    this.iniciarGraficos();
    this.cargar();
  }

  iniciarGraficos() {
    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar',
      data: { labels: [], datasets: [{ label: 'Publicaciones', data: [], backgroundColor: '#3b82f6' }] },
      options: { responsive: true, plugins: { legend: { position: 'top' } } },
    });

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: { labels: [], datasets: [{ label: 'Comentarios por día', data: [], borderColor: '#10b981', tension: 0.3, fill: false }] },
      options: { responsive: true, plugins: { legend: { position: 'top' } } },
    });

    this.pieChart = new Chart(this.pieCanvas.nativeElement, {
      type: 'pie',
      data: { labels: [], datasets: [{ label: 'Comentarios', data: [], backgroundColor: ['#f59e0b','#ef4444','#8b5cf6','#06b6d4','#84cc16','#ec4899'] }] },
      options: { responsive: true, plugins: { legend: { position: 'right' } } },
    });
  }

  cargar() {
    this.cargando.set(true);
    const d = this.desde();
    const h = this.hasta();

    this.estadisticasService.publicacionesPorUsuario(d, h).subscribe({
      next: (data) => {
        this.barChart!.data.labels = data.map((x: any) => x.label);
        this.barChart!.data.datasets[0].data = data.map((x: any) => x.total);
        this.barChart!.update();
      },
    });

    this.estadisticasService.comentariosPorTiempo(d, h).subscribe({
      next: (data) => {
        this.lineChart!.data.labels = data.map((x: any) => x.label);
        this.lineChart!.data.datasets[0].data = data.map((x: any) => x.total);
        this.lineChart!.update();
      },
    });

    this.estadisticasService.comentariosPorPublicacion(d, h).subscribe({
      next: (data) => {
        this.pieChart!.data.labels = data.map((x: any) => x.label);
        this.pieChart!.data.datasets[0].data = data.map((x: any) => x.total);
        this.pieChart!.update();
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  aplicarFiltro() {
    this.cargar();
  }

  ngOnDestroy() {
    this.barChart?.destroy();
    this.lineChart?.destroy();
    this.pieChart?.destroy();
  }
}
