import {Component, Input, signal} from '@angular/core';
import {EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent {

  @Input() viewModel!: EditDialogViewModel;
  showBetragWarnung = signal<boolean>(false);


  onSaveClicked() {
    this.viewModel.data.onSaveClick;
  }

  onCancelClicked() {
    this.viewModel.data.onCancelClick;
  }

  onBackgroundClicked() {
    console.log(68736742634632872)
  }
}
