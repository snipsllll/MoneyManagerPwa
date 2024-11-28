import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";
import {NewIAuswertungsLayout, NewIDiagramm} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-create-auswertungs-layout-dialog',
  templateUrl: './create-auswertungs-layout-dialog.component.html',
  styleUrl: './create-auswertungs-layout-dialog.component.css'
})
export class CreateAuswertungsLayoutDialogComponent implements OnInit{
  @Input() viewModel!: NewIAuswertungsLayout; //CreateAuswertungsLayoutDialogViewModel;
  @Output() saveClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  isSaveEnabled = signal<boolean>(true);

  constructor(public dialogService: DialogService) {
  }

  ngOnInit() {
    if(!this.viewModel) {
      this.viewModel = {
        id: this.getNextFreeDiagramId(),
        data: {
          layoutTitle: '',
          diagramme: []
        }
      }
    }
    if (!this.viewModel.data.diagramme) {
      this.viewModel.data.diagramme = [];
      this.viewModel.data.diagramme.push(this.getNewEmptyDiagramDetailsViewModel());
    }
  }

  update(viewModel?: DiagramDetailsViewModel) {
    //this.updateIsSaveEnabled();
  }

  protected onCreateDiagramDeleteClicked(id: number) {
    this.viewModel.data.diagramme?.splice(this.viewModel.data.diagramme?.findIndex(diagram => diagram.id === id), 1);
    if(this.viewModel.data.diagramme?.length === 0) {
      this.viewModel.data.diagramme.push(this.getNewEmptyDiagramDetailsViewModel());
    }
  }

  protected onCancelClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
    this.cancelClicked.emit()
  }

  protected onSaveClicked() {
    if(this.isSaveEnabled()) {
      this.saveClicked.emit(this.viewModel);
      this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
    }

  }

  protected onPlusClicked() {
    this.viewModel.data.diagramme!.push(this.getNewEmptyDiagramDetailsViewModel());
  }

  updateIsSaveEnabled() {
    let enabled = true;

    this.viewModel.data.diagramme?.forEach(diagram => {
      if(!diagram.data.xAchse) {
        enabled = false;
      }
      if(!diagram.data.yAchse) {
        enabled = false;
      }
    });

    this.isSaveEnabled.set(enabled);
  }

  private getNewEmptyDiagramDetailsViewModel(): NewIDiagramm {
    return {
      id: this.getNextFreeDiagramId(),
      data: {
        diagramTitle: '',
        balkenBeschriftung: '',
        xAchse: '',
        yAchse: '',
        filterOption: {
          filter: '--kein Filter--',
          value: undefined
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
