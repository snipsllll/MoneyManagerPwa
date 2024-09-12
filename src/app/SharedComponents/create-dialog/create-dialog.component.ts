import {Component, Input, OnInit, signal} from '@angular/core';
import {CreateDialogEintrag, CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";

@Component({
  selector: 'app-create-dialog',
  templateUrl: './create-dialog.component.html',
  styleUrl: './create-dialog.component.css'
})
export class CreateDialogComponent implements OnInit {

  @Input() viewModel!: CreateDialogViewModel;
  showBetragWarnung = signal<boolean>(false);
  darfSpeichern = signal<boolean>(false);
  eintrag!: CreateDialogEintrag;

  constructor(private dialogService: DialogService) {
  }

  ngOnInit() {
    this.eintrag = {
      betrag: 0,
      title: undefined,
      zusatz: undefined
    }
  }

  onCancelClicked() {
    if(this.checkHasChanged()) {
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Abbrechen?',
        message: 'Willst du wirklich abbrechen? Alle nicht gespeicherten Änderungen werden verworfen!',
        onConfirmClicked: () => {
          this.viewModel.onCancelClick();
        },
        onCancelClicked() {

        }
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    } else {
      this.viewModel.onCancelClick();
    }
  }

  onSaveClicked() {
    if(!this.checkBetragValid()) {
      this.showBetragWarnung.set(true);
      return;
    }
    if(this.checkDarfSpeichern()) {
      this.viewModel.onSaveClick(this.eintrag);
    }
  }

  onBackgroundClicked() {
    console.log(68736742634632872)
  }

  onValueChanged() {
    this.darfSpeichern.set(this.checkDarfSpeichern());
  }

  checkDarfSpeichern() {
    return this.checkHasChanged() && this.checkBetragValid()
  }

  checkHasChanged() {
    return ((this.eintrag.title !== undefined && this.eintrag.title !== null) || (this.eintrag.betrag !== 0 && this.eintrag.betrag !== null) || (this.eintrag.zusatz !== undefined && this.eintrag.zusatz !== null))
  }

  checkBetragValid() {
    return (this.eintrag.betrag !== 0 && this.eintrag.betrag !== null);
  }

}
