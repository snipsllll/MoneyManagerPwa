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
      betrag: undefined,
      title: '',
      beschreibung: '',
      vonHeuteAbziehen: false
    }
  }

  onCancelClicked() {
    if(this.checkHasChanged()) {
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Abbrechen?',
        message: 'Willst du wirklich abbrechen? Alle nicht gespeicherten Änderungen werden verworfen!',
        onConfirmClicked: () => {
          this.dialogService.isCreateDialogVisible = false;
          this.viewModel.onCancelClick();
        },
        onCancelClicked() {}
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    } else {
      this.dialogService.isCreateDialogVisible = false;
      this.viewModel.onCancelClick();
    }
  }

  onSaveClicked() {
    if(!this.checkBetragValid()) {
      this.showBetragWarnung.set(true);
      return;
    }
    if(this.checkDarfSpeichern()) {
      this.dialogService.isCreateDialogVisible = false;
      this.viewModel.onSaveClick(this.eintrag);
    }
  }

  onBackgroundClicked() {

  }

  onValueChanged() {
    if(this.eintrag.betrag !== null && this.eintrag.betrag !== undefined)
      this.eintrag.betrag = +(this.eintrag.betrag?.toFixed(2));

    this.darfSpeichern.set(this.checkDarfSpeichern());
  }

  onVonHeuteAbziehenClicked() {
    this.eintrag.vonHeuteAbziehen = !this.eintrag.vonHeuteAbziehen;
  }

  private checkDarfSpeichern() {
    return this.checkHasChanged() && this.checkBetragValid()
  }

  private checkHasChanged() {
    return !((this.eintrag.title === undefined || this.eintrag.title === '') && (this.eintrag.beschreibung === undefined || this.eintrag.beschreibung === '') && (this.eintrag.betrag === undefined || this.eintrag.betrag === 0));
  }

  private checkBetragValid() {
    return (this.eintrag.betrag !== 0 && this.eintrag.betrag !== null);
  }
}
