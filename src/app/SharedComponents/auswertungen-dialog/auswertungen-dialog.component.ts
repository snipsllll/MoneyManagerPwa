import {Component, Input} from '@angular/core';
import {BuchungsKategorienDialogViewModel} from "../../Models/ViewModels/BuchungsKategorienDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {ListElementData, ListElementSettings, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {IAuswertungsLayout} from "../../Models/NewInterfaces";
import {AuswertungenDialogViewModel} from "../../Models/ViewModels/AuswertungenDialogViewModel";

@Component({
  selector: 'app-auswertungen-dialog',
  templateUrl: './auswertungen-dialog.component.html',
  styleUrl: './auswertungen-dialog.component.css'
})
export class AuswertungenDialogComponent {
  @Input() viewModel!: AuswertungenDialogViewModel;
  newEintrag!: { id: number, name: string };

  constructor(private dialogService: DialogService, public dataService: DataService) {
  }

  ngOnInit() {
    this.newEintrag = {
      id: -1,
      name: ''
    }
  }

  onCancelClicked() {
    if (this.checkHasChanged()) {
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Abbrechen?',
        message: 'Willst du wirklich abbrechen? Alle nicht gespeicherten Änderungen werden verworfen!',
        onConfirmClicked: () => {
          this.dialogService.isCreateDialogVisible = false;
          this.viewModel.onAbortClicked();
        },
        onCancelClicked() {
        }
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    } else {
      this.dialogService.isCreateDialogVisible = false;
      this.viewModel.onAbortClicked();
    }
  }

  onSaveClicked() {
    if (this.checkDarfSpeichern()) {
      this.dialogService.isCreateDialogVisible = false;
      this.viewModel.onSaveClicked(this.viewModel.elemente);
    }
  }

  checkHasChanged() {
    return true;
  }

  checkDarfSpeichern() {
    return true;
  }

  onPlusClicked() {
    this.dialogService.showCreateAuswertungsLayoutDialog({});
  }

  getViewModel(eintrag: IAuswertungsLayout): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: false
    }

    const data: ListElementData = {
      id: eintrag.id,
      title: eintrag.data.titel,
      menuItems: [
        {
          label: 'bearbeiten',
          onClick: this.onEditClicked
        },
        {
          label: 'löschen',
          onClick: this.onDeleteClicked
        }
      ]
    }

    return {
      settings: settings,
      data: data
    }
  }

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    console.log(eintrag)
    const newEintrag: IAuswertungsLayout = {
      id: 0,
      data: {
        titel: '',
        diagramme: [

        ]
      }
    }
    this.viewModel.elemente.push(newEintrag);
    console.log(this.viewModel)
    this.newEintrag = {
      id: -1,
      name: ''
    }
  }

  onCreateCancelClicked = () => {

  }

  onEditClicked = (eintrag: ListElementData) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        title: eintrag.title,
        id: eintrag.id!
      },
      onSaveClick: this.onEditSaveClicked,
      onCancelClick: this.onEditCancelClicked,
      isZusatzAusgeblendet: true,
      isBetragAusgeblendet: true
    }
    this.dialogService.showEditDialog(editDialogViewModel);
  }

  onDeleteClicked = (x: EditDialogData) => {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.viewModel.elemente.splice(this.viewModel.elemente.findIndex(eintrag => eintrag.id === x.id), 1);
      },
      onCancelClicked: () => {
      }
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newEintrag: IAuswertungsLayout = {
      id: eintrag.id,
      data: {
        titel: '',
        diagramme: [

        ]
      }
    }

    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === newEintrag.id)] = newEintrag;
  }

  onEditCancelClicked = () => {
  }
}
