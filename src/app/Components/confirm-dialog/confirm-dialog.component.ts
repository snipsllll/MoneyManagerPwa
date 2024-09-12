import {Component, OnInit} from '@angular/core';
import {ConfirmDialogViewModel} from "../../Models/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";

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
    this.viewModel?.onConfirmClicked();
  }

  onCanceluttonClicked() {
    this.viewModel?.onCancelClicked();
  }
}
