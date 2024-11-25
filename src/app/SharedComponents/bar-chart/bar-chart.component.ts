import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';
import {BarChartViewModel} from "../../Models/NewInterfaces";

@Component({
  selector: 'app-bar-chart',
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.css'
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() viewModel!: BarChartViewModel; // Input für das ViewModel
  private chart!: Chart;

  constructor() {
    // Registrieren der benötigten Chart.js-Module
    Chart.register(...registerables);
  }

  ngOnInit(): void {
    if (this.viewModel) {
      this.renderChart();
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['viewModel'] && !changes['viewModel'].firstChange) {
      // Aktualisieren des Diagramms bei Änderungen
      this.updateChart();
    }
  }

  private renderChart(): void {
    const canvas = document.getElementById('barChartCanvas') as HTMLCanvasElement;
    const context = canvas.getContext('2d');

    if (context) {
      const config: ChartConfiguration = {
        type: 'bar',
        data: {
          labels: this.viewModel.labels,
          datasets: [
            {
              label: 'Werte',
              data: this.viewModel.data,
              backgroundColor: this.viewModel.backgroundColors || 'rgba(75, 192, 192, 0.6)',
            },
          ],
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
    }
  }

  private updateChart(): void {
    if (this.chart) {
      this.chart.data.labels = this.viewModel.labels;
      this.chart.data.datasets[0].data = this.viewModel.data;
      if (this.viewModel.backgroundColors) {
        this.chart.data.datasets[0].backgroundColor = this.viewModel.backgroundColors;
      }
      this.chart.update();
    }
  }
}
