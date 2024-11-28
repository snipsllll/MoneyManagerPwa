import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {IAuswertungsLayout, IDiagramm} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-create-auswertungs-layout-dialog',
  templateUrl: './create-auswertungs-layout-dialog.component.html',
  styleUrl: './create-auswertungs-layout-dialog.component.css'
})
export class CreateAuswertungsLayoutDialogComponent implements OnInit{
  @Input() viewModel!: IAuswertungsLayout;
  @Output() saveClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  isSaveEnabled = signal<boolean>(true);

  constructor(public dialogService: DialogService) {
  }

  ngOnInit() {
    console.log(this.viewModel)
    if(!this.viewModel) {
      this.viewModel = {
        id: this.getNextFreeDiagramId(),
        data: {
          layoutTitle: '',
          diagramme: []
        }
      }
    }
    if (!this.viewModel.data.diagramme || this.viewModel.data.diagramme.length === 0) {
      this.viewModel.data.diagramme = [];
      this.viewModel.data.diagramme.push(this.getNewEmptyDiagramDetailsViewModel());
    }
  }

  protected onCreateDiagramDeleteClicked(id: number) {
    this.viewModel.data.diagramme?.splice(this.viewModel.data.diagramme?.findIndex(diagram => diagram.id === id), 1);
    if(this.viewModel.data.diagramme?.length === 0) {
      this.viewModel.data.diagramme.push(this.getNewEmptyDiagramDetailsViewModel());
    }
  }

  protected onCancelClicked() {
    this.cancelClicked.emit()
  }

  protected onSaveClicked() {
    if(this.isSaveEnabled()) {
      this.saveClicked.emit(this.viewModel);
    }
  }

  protected onPlusClicked() {
    this.viewModel.data.diagramme!.push(this.getNewEmptyDiagramDetailsViewModel());
  }

  private getNewEmptyDiagramDetailsViewModel(): IDiagramm {
    return {
      id: this.getNextFreeDiagramId(),
      data: {
        selectedDiagramType: '',
        diagramTitle: '',
        balkenBeschriftung: '',
        xAchse: '',
        yAchse: '',
        filterOption: {
          filter: '--kein Filter--',
          value: undefined
        },
        lineOption: {
          lineType: '--keine Linie--',
          lineValue: undefined
        }
      }
    }
  }

  private getNextFreeDiagramId() {
    let freeId = 1;
    for (let i = 0; i < this.viewModel.data.diagramme!.length; i++) {
      if (this.viewModel.data.diagramme!.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  getEnumValueByKey(enumKey: string, enumObj: any): number | undefined {
    // Überprüft, ob der Schlüssel existiert
    if (enumKey in enumObj) {
      return enumObj[enumKey as keyof typeof enumObj];
    }
    return undefined; // Falls der Schlüssel ungültig ist
  }
}
