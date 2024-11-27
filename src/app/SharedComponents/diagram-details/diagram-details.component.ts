import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {BarChartFilterOptions, BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";

@Component({
  selector: 'app-diagram-details',
  templateUrl: './diagram-details.component.html',
  styleUrl: './diagram-details.component.css'
})
export class DiagramDetailsComponent {
  @Input() viewModel!: DiagramDetailsViewModel;
  @Output() deleteClicked = new EventEmitter();

  // Extrahiere die Enum-Schlüssel für das Dropdown
  wertOptions = Object.keys(BarChartValueOptions).filter(key => isNaN(Number(key)));

  xAchseOptions = Object.keys(XAchsenSkalierungsOptionen).filter(key => isNaN(Number(key)));
  filterOptions = Object.keys(BarChartFilterOptions).filter(key => isNaN(Number(key)));

  constructor() {
    console.log(888)
  }

  onDeleteClicked() {
    this.deleteClicked.emit(this.viewModel.id);
  }


  protected readonly XAchsenSkalierungsOptionen = XAchsenSkalierungsOptionen;
}
