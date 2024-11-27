import {Component, Input} from '@angular/core';
import {BarChartViewModel} from "../../Models/NewInterfaces";

@Component({
  selector: 'app-mm-bar-chart',
  templateUrl: './mm-bar-chart.component.html',
  styleUrl: './mm-bar-chart.component.css'
})
export class MmBarChartComponent {
  @Input() chart!: BarChartViewModel;
}
