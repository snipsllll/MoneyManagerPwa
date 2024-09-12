import {Component, OnInit} from '@angular/core';
import {DialogService} from "../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent  implements OnInit{
  viewModel?: ConfirmDialogViewModel;

  constructor(private dialogService: DialogService) {

  }

  ngOnInit() {
    this.viewModel = this.dialogService.confirmDialogViewModel;
  }

  onConfirmButtonClicked() {
    this.dialogService.isConfirmDialogVisible = false;
    this.viewModel?.onConfirmClicked();
  }

  onCanceluttonClicked() {
    this.dialogService.isConfirmDialogVisible = false;
    this.viewModel?.onCancelClicked();
  }
}
