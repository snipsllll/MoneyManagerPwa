import { Component } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
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
