import {Component, Input, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit} from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {BarChartViewModel} from "../../Models/NewInterfaces";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements AfterViewInit, OnChanges {
  @Input() viewModel!: BarChartViewModel;
  @Input() chartId!: string; // Kann optional sein, wird hier aber nicht mehr direkt benutzt

  @ViewChild('chartCanvas', { static: false }) chartCanvas!: ElementRef<HTMLCanvasElement>; // Zugriff auf den Canvas
  private chart!: Chart;

  constructor() {
    Chart.register(...registerables);
  }

  ngAfterViewInit(): void {
    if (this.viewModel) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewModel'] && !changes['viewModel'].firstChange) {
      this.updateChart();
    }
  }

  private renderChart(): void {
    const context = this.chartCanvas.nativeElement.getContext('2d'); // Sichere Verwendung von ViewChild
    if (context) {
      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: this.viewModel.labels,
          datasets: this.viewModel.datasets.map(dataset => ({
            label: dataset.label,
            data: dataset.data,
            backgroundColor: dataset.backgroundColor,
          })),
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: 'top',
            },
          },
        },
      };

      this.chart = new Chart(context, config);
    } else {
      console.error('Canvas context not available.');
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.viewModel.labels;
      this.chart.data.datasets = this.viewModel.datasets.map(dataset => ({
        label: dataset.label,
        data: dataset.data,
        backgroundColor: dataset.backgroundColor,
      }));
      this.chart.update();
    }
  }
}
