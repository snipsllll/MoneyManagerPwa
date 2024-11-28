import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {IDiagramm, IDiagrammData} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-diagram-details',
  templateUrl: './diagram-details.component.html',
  styleUrl: './diagram-details.component.css'
})
export class DiagramDetailsComponent implements OnInit{
  @Input() viewModel!: IDiagramm;
  @Output() deleteClicked = new EventEmitter();
  @Output() updated = new EventEmitter();

  presetDiagrammeList: IDiagrammData[] = [];
  diagrammAuswahlList: string[] = [];
  xAchseAuswahlList = ['Alle tage im Monat', 'alle Monate im Jahr'];
  yAchseAuswahlList = ['Ausgaben', 'Restgeld', 'Sparen', 'TotalBudget', 'Differenz zum daily Budget']
  filterTypeAuswahlList = ['nach Kategorie', 'nach Wochentag', '--kein Filter--'];
  filterOptionWochentage = ['Montag', 'Dienstag', 'Mitwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];
  lineTypeAuswahlList = ['daily Budget', 'benutzerdefiniert', '--keine Linie--'];
  filterOptionKategorien: string[] = [];
  benutzerdefiniert = false;

  constructor(private dataProvider: DataProviderService) {
  }

  ngOnInit() {
    this.presetDiagrammeList = this.dataProvider.getPresetDiagramme();
    this.presetDiagrammeList.forEach(diagram => {
      this.diagrammAuswahlList.push(diagram.diagramTitle);
    })
    this.diagrammAuswahlList.push('benutzerdefiniert')
    this.filterOptionKategorien = this.dataProvider.getBuchungsKategorienNamen();
    this.update();
  }

  onDeleteClicked() {
    this.deleteClicked.emit(this.viewModel.id);
  }

  onDiagramTypeChanged() {
    if(this.viewModel.data.selectedDiagramType !== 'benutzerdefiniert') {
      let selectedDiagram = this.presetDiagrammeList.find(diagram => this.viewModel.data.selectedDiagramType === diagram.diagramTitle)!;
      selectedDiagram.selectedDiagramType = this.viewModel.data.selectedDiagramType;
      this.viewModel.data = selectedDiagram;
      this.update();
    }
  }

  update() {
    this.viewModel.data.lineOption = this.viewModel.data.lineOption ?? {lineType: '', lineValue: 0};
    this.viewModel.data.lineOption.lineType = this.viewModel.data.lineOption.lineType ?? '';
    this.viewModel.data.lineOption.lineValue = this.viewModel.data.lineOption.lineValue ?? 0;

    this.viewModel.data.filterOption = this.viewModel.data.filterOption ?? {filter: '--kein Filter--', value: undefined};
    this.viewModel.data.filterOption.filter = this.viewModel.data.filterOption.filter ?? '--kein Filter--';
    this.viewModel.data.filterOption.value = this.viewModel.data.filterOption.value ?? '';
  }
}
