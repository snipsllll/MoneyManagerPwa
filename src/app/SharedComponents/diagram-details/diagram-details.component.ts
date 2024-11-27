import {Component, EventEmitter, Input, input, Output} from '@angular/core';
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {BarChartFilterOptions, BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";

@Component({
  selector: 'app-diagram-details',
  templateUrl: './diagram-details.component.html',
  styleUrl: './diagram-details.component.css'
})
export class DiagramDetailsComponent {
  @Input() viewModel!: DiagramDetailsViewModel;
  @Output() deleteClicked = new EventEmitter();
  @Output() updated = new EventEmitter();

  // Extrahiere die Enum-Schlüssel für das Dropdown
  wertOptions = Object.keys(BarChartValueOptions).filter(key => isNaN(Number(key)));

  xAchseOptions = Object.keys(XAchsenSkalierungsOptionen).filter(key => isNaN(Number(key)));
  filterOptions = Object.keys(BarChartFilterOptions).filter(key => isNaN(Number(key)));
  filterOptionWochentage: string[] = [];
  filterOptionKategorien: string[] = [];

  constructor(private dataProvider: DataProviderService) {
    this.filterOptionKategorien = this.dataProvider.getBuchungsKategorienNamen();
    this.filterOptionWochentage = ['Montag', 'Dienstag', 'Mitwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
    console.log(888)
  }

  onDeleteClicked() {
    this.deleteClicked.emit(this.viewModel.id);
  }

  sendUpdate() {
    this.updated.emit(this.viewModel);
  }


  protected readonly XAchsenSkalierungsOptionen = XAchsenSkalierungsOptionen;
  protected readonly BarChartFilterOptions = BarChartFilterOptions;
}
