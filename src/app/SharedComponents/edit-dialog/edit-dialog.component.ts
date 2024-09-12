import {Component, Input, OnInit, signal} from '@angular/core';
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";

@Component({
  selector: 'app-edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrl: './edit-dialog.component.css'
})
export class EditDialogComponent implements OnInit{

  @Input() viewModel!: EditDialogViewModel;
  showBetragWarnung = signal<boolean>(false);
  darfSpeichern = signal<boolean>(false);
  oldEintrag!: EditDialogData;

  ngOnInit() {
    this.oldEintrag = this.viewModel.data
  }

  onSaveClicked() {
    if(!this.checkBetragValid()) {
      this.showBetragWarnung.set(true);
      return;
    }
    if(this.checkDarfSpeichern()) {
      this.viewModel.data.onSaveClick;
    }
  }

  onCancelClicked() {
    this.viewModel.data.onCancelClick;
  }

  onBackgroundClicked() {
    console.log(68736742634632872)
  }

  onValueChanged() {
    this.darfSpeichern.set(this.checkDarfSpeichern());
  }

  checkDarfSpeichern() {
    return (this.oldEintrag.title !== this.viewModel.data.title || this.oldEintrag.betrag !== this.viewModel.data.betrag || this.oldEintrag.zusatz !== this.viewModel.data.zusatz) && this.checkBetragValid()
  }

  checkBetragValid() {
    return (this.viewModel.data.betrag !== 0 && this.viewModel.data.betrag !== null);
  }
}
