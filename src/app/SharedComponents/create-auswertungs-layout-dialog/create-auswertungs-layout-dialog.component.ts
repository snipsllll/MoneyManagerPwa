import {Component, Input} from '@angular/core';
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";

@Component({
  selector: 'app-create-auswertungs-layout-dialog',
  templateUrl: './create-auswertungs-layout-dialog.component.html',
  styleUrl: './create-auswertungs-layout-dialog.component.css'
})
export class CreateAuswertungsLayoutDialogComponent {
  @Input() viewModel!: CreateAuswertungsLayoutDialogViewModel;

  getDiagramDetailsViewModel(): DiagramDetailsViewModel {
    return {
      title: 'test titel',
      filter: [],
      wert: BarChartValueOptions.Restgeld,
      xAchse: XAchsenSkalierungsOptionen.alleTageImMonat,
      id: 0
    }
  }

  constructor(public dialogService: DialogService) {
  }

  onCancelClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
  }

  onSaveClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
  }
}
