import {Component, Input, OnInit, signal} from '@angular/core';
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";

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

  constructor(private dialogService: DialogService) {
  }

  ngOnInit() {
    this.oldEintrag = {
      betrag: this.viewModel.data.betrag!,
      title: this.viewModel.data.title ?? '',
      zusatz: this.viewModel.data.zusatz ?? '',
      date: this.viewModel.data.date!,
      id: this.viewModel.data.id,
      vonHeuteAbziehen: this.viewModel.data.vonHeuteAbziehen ?? false
    }

    this.viewModel.isBetragAusgeblendet = this.viewModel.isBetragAusgeblendet ?? false;
  }

  onSaveClicked() {
    if(!this.checkBetragValid()) {
      this.showBetragWarnung.set(true);
      return;
    }
    if(this.checkDarfSpeichern()) {
      this.dialogService.isEditDialogVisible = false;
      this.viewModel.onSaveClick(this.viewModel.data);
    }
  }

  onCancelClicked() {
    if(this.checkHasChanged()) {
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Abbrechen?',
        message: 'Willst du wirklich abbrechen? Alle nicht gespeicherten Änderungen werden verworfen!',
        onConfirmClicked: () => {
          this.dialogService.isEditDialogVisible = false;
          this.viewModel.onCancelClick();
        },
        onCancelClicked() {}
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    } else {
      this.dialogService.isEditDialogVisible = false;
      this.viewModel.onCancelClick();
    }
  }

  onBackgroundClicked() {

  }

  onValueChanged() {
    if(this.viewModel.data.betrag !== null && this.viewModel.data.betrag !== undefined)
      this.viewModel.data.betrag = +(this.viewModel.data.betrag?.toFixed(2));

    this.darfSpeichern.set(this.checkDarfSpeichern());
  }

  onVonHeuteAbziehenClicked() {
    this.viewModel.data.vonHeuteAbziehen = !this.viewModel.data.vonHeuteAbziehen;
  }

  private checkDarfSpeichern() {
    return this.checkHasChanged() && this.checkBetragValid()
  }

  private checkBetragValid() {
    return (this.viewModel.data.betrag !== 0 && this.viewModel.data.betrag !== null && this.viewModel.data.betrag !== undefined) || this.viewModel.isBetragAusgeblendet!;
  }

  private checkHasChanged() {
    return (this.oldEintrag.title !== this.viewModel.data.title || this.oldEintrag.betrag !== this.viewModel.data.betrag || this.oldEintrag.zusatz !== this.viewModel.data.zusatz)
  }
}
