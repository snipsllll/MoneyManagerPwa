import {Component, Input} from '@angular/core';
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";

@Component({
  selector: 'app-create-auswertungs-layout-dialog',
  templateUrl: './create-auswertungs-layout-dialog.component.html',
  styleUrl: './create-auswertungs-layout-dialog.component.css'
})
export class CreateAuswertungsLayoutDialogComponent {
  @Input() viewModel!: CreateAuswertungsLayoutDialogViewModel;

  constructor(public dialogService: DialogService) {
  }

  onCancelClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
  }

  onSaveClicked() {
    this.dialogService.isCreateAuswertungsLayoutDialogVisible = false;
  }
}
