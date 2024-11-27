import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {XAchsenSkalierungsOptionen} from "../../Models/Enums";

@Component({
  selector: 'app-create-auswertungs-layout-dialog',
  templateUrl: './create-auswertungs-layout-dialog.component.html',
  styleUrl: './create-auswertungs-layout-dialog.component.css'
})
export class CreateAuswertungsLayoutDialogComponent implements OnInit{
  @Input() viewModel!: CreateAuswertungsLayoutDialogViewModel;
  @Output() saveClicked = new EventEmitter();

  constructor(public dialogService: DialogService) {
    if(!this.viewModel) {
      this.viewModel = {
        title: '',
        diagramme: []
      }
    }
    console.log(this.viewModel)
  }

  ngOnInit() {
    if (!this.viewModel.diagramme) {
      this.viewModel.diagramme = [];
    }
  }

  protected onCreateDiagramDeleteClicked(id: number) {
    console.log(76767)
    this.viewModel.diagramme?.splice(this.viewModel.diagramme?.findIndex(diagram => diagram.id === id), 1);
  }

  protected onCancelClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
  }

  protected onSaveClicked() {
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

  protected onPlusClicked() {
    this.viewModel.diagramme!.push(this.getNewEmptyDiagramDetailsViewModel());
    console.log(this.viewModel)
  }

  private getNewEmptyDiagramDetailsViewModel(): DiagramDetailsViewModel {
    return {
      id: this.getNextFreeDiagramId(),
      color: '',
      wert: undefined,
      title: undefined,
      filter: undefined,
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
