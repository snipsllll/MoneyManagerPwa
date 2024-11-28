import {Component, EventEmitter, Input, Output} from '@angular/core';
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {
  BarChartFilterOptions,
  BarChartValueOptions,
  HorizontalelinieOptions,
  XAchsenSkalierungsOptionen
} from "../../Models/Enums";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {IDiagramm} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-diagram-details',
  templateUrl: './diagram-details.component.html',
  styleUrl: './diagram-details.component.css'
})
export class DiagramDetailsComponent {
  @Input() viewModel!: IDiagramm;
  @Output() deleteClicked = new EventEmitter();
  @Output() updated = new EventEmitter();

  diagrammAuswahlList = ['Diagram 1', 'Diagram 2', 'Diagram 3', 'benutzerdefiniert'];
  xAchseAuswahlList = ['alle Monate im Jahr', 'Alle tage im Monat'];
  yAchseAuswahlList = ['Ausgaben', 'Restgeld', 'Sparen', 'TotalBudget', 'Differenz zum daily Budget']
  filterTypeAuswahlList = ['nach Kategorie', 'nach Wochentag', '--kein Filter--'];
  filterOptionWochentage = ['Montag', 'Dienstag', 'Mitwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  lineTypeAuswahlList = ['daily Budget', 'benutzerdefiniert'];
  selectedDiagramType: string = '';
  filterOptionKategorien: string[] = [];
  benutzerdefiniert = false;

  constructor(private dataProvider: DataProviderService) {
    this.filterOptionKategorien = this.dataProvider.getBuchungsKategorienNamen();

    this.viewModel.data.lineOption = this.viewModel.data.lineOption ?? {lineType: '', lineValue: 0};
    this.viewModel.data.lineOption.lineType = this.viewModel.data.lineOption.lineType ?? '';
    this.viewModel.data.lineOption.lineValue = this.viewModel.data.lineOption.lineValue ?? 0;

    this.viewModel.data.filterOption = this.viewModel.data.filterOption ?? {filter: '--kein Filter--', value: undefined};
    this.viewModel.data.filterOption.filter = this.viewModel.data.filterOption.filter ?? '--kein Filter--';
    this.viewModel.data.filterOption.value = this.viewModel.data.filterOption.value ?? '';
  }

  onDeleteClicked() {
    this.deleteClicked.emit(this.viewModel.id);
  }
}
