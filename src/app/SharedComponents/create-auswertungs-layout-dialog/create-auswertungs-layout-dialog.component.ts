import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";

@Component({
  selector: 'app-create-auswertungs-layout-dialog',
  templateUrl: './create-auswertungs-layout-dialog.component.html',
  styleUrl: './create-auswertungs-layout-dialog.component.css'
})
export class CreateAuswertungsLayoutDialogComponent implements OnInit{
  @Input() viewModel!: CreateAuswertungsLayoutDialogViewModel;
  @Output() saveClicked = new EventEmitter();
  @Output() cancelClicked = new EventEmitter();
  isSaveEnabled = signal<boolean>(true);

  constructor(public dialogService: DialogService) {
  }

  ngOnInit() {
    if(!this.viewModel) {
      this.viewModel = {
        id: undefined,
        title: '',
        diagramme: []
      }
    }
    console.log(this.viewModel)
    if (!this.viewModel.diagramme) {
      this.viewModel.diagramme = [];
      this.viewModel.diagramme.push(this.getNewEmptyDiagramDetailsViewModel());
    }
  }

  update(viewModel: DiagramDetailsViewModel) {
    this.updateIsSaveEnabled();
  }

  protected onCreateDiagramDeleteClicked(id: number) {
    console.log(76767)
    this.viewModel.diagramme?.splice(this.viewModel.diagramme?.findIndex(diagram => diagram.id === id), 1);
    if(this.viewModel.diagramme?.length === 0) {
      this.viewModel.diagramme.push(this.getNewEmptyDiagramDetailsViewModel());
    }
  }

  protected onCancelClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
    this.cancelClicked.emit()
  }

  protected onSaveClicked() {
    if(this.isSaveEnabled()) {
      this.viewModel.diagramme?.forEach(diagram => {
        switch(diagram.xAchse) {
          case XAchsenSkalierungsOptionen.alleTageImMonat:
            diagram.xAchse = XAchsenSkalierungsOptionen.alleTageImMonat
            break;
          case XAchsenSkalierungsOptionen.alleMonateImJahr:
            diagram.xAchse = XAchsenSkalierungsOptionen.alleMonateImJahr
            break;
        }
        //diagram.xAchse = XAchsenSkalierungsOptionen[diagram.xAchse!]
      })
      console.log(this.viewModel)
      this.saveClicked.emit(this.viewModel);
      this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
    }

  }

  protected onPlusClicked() {
    this.viewModel.diagramme!.push(this.getNewEmptyDiagramDetailsViewModel());
    console.log(this.viewModel)
  }

  updateIsSaveEnabled() {
    let enabled = true;

    this.viewModel.diagramme?.forEach(diagram => {
      if(!diagram.xAchse) {
        enabled = false;
      }
      if(!diagram.wert) {
        enabled = false;
      }
    });

    this.isSaveEnabled.set(enabled);
  }

  private getNewEmptyDiagramDetailsViewModel(): DiagramDetailsViewModel {
    return {
      id: this.getNextFreeDiagramId(),
      color: '',
      wert: undefined,
      title: undefined,
      filter: {
        filter: undefined,
        value: undefined
      },
      xAchse: undefined
    }
  }

  private getNextFreeDiagramId() {
    let freeId = 1;
    for (let i = 0; i < this.viewModel.diagramme!.length; i++) {
      if (this.viewModel.diagramme!.find(x => x.id === freeId) === undefined) {
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
