import {Component, computed, Input, OnInit, signal} from '@angular/core';
import {IFixkostenEintrag, IFixkostenEintragData, IMonthFixkostenEintrag} from "../../../Models/NewInterfaces";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {MonatFixkostenDialogViewModel} from "../../../Models/ViewModels/MonatFixkostenDialogViewModel";

@Component({
  selector: 'app-monat-fixkosten-dialog',
  templateUrl: './monat-fixkosten-dialog.component.html',
  styleUrl: './monat-fixkosten-dialog.component.css'
})
export class MonatFixkostenDialogComponent implements OnInit {
  @Input() viewModel!: MonatFixkostenDialogViewModel;
  summe = computed(() => {
    this.dataService.updated();
    let summe = 0;
    this.viewModel.elemente.forEach(element => {
      if (element.data.isExcluded !== true) {
        summe += element.data.betrag;
      }
    })
    return summe;
  })
  newFixKostenEintrag!: IFixkostenEintragData;

  constructor(private dialogService: DialogService, public dataService: DataService) {
  }

  ngOnInit() {
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      zusatz: ''
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
      this.viewModel.onSaveClicked(this.viewModel);
    }
  }

  checkHasChanged() {
    return true;
  }

  checkDarfSpeichern() {
    return true;
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
  }

  getViewModel(eintrag: IMonthFixkostenEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: true
    }

    const data: ListElementData = {
      id: eintrag.id,
      betrag: eintrag.data.betrag,
      title: eintrag.data.title,
      zusatz: eintrag.data.zusatz,
      isStandardFixkostenEintrag: eintrag.data.isStandardFixkostenEintrag,
      isExcluded: eintrag.data.isExcluded,
      menuItems: eintrag.data.isStandardFixkostenEintrag
        ? [
          {
            label: 'ausschließen',
            onClick: this.onAusschliessenClicked,
            grayedOut: eintrag.data.isExcluded
          },
          {
            label: 'einschließen',
            onClick: this.onEinschliessenClicked,
            grayedOut: !eintrag.data.isExcluded
          }
        ]
        : [
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
    const newFixkostenEintrag: IMonthFixkostenEintrag = {
      id: 0,
      data: {
        betrag: eintrag.betrag ?? 0,
        title: eintrag.title ?? 'kein Titel',
        zusatz: eintrag.zusatz,
        isExcluded: false,
        isStandardFixkostenEintrag: false
      }
    }
    this.viewModel.elemente.push(newFixkostenEintrag);
    console.log(this.viewModel)
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      zusatz: ''
    }
    this.dataService.update()
  }

  onCreateCancelClicked = () => {

  }

  onEditClicked = (eintrag: ListElementData) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title,
        zusatz: eintrag.zusatz,
        id: eintrag.id!
      },
      onSaveClick: this.onEditSaveClicked,
      onCancelClick: this.onEditCancelClicked
    }
    this.dialogService.showEditDialog(editDialogViewModel);
  }

  onDeleteClicked = (x: EditDialogData) => {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.viewModel.elemente.splice(this.viewModel.elemente.findIndex(eintrag => eintrag.id === x.id), 1);
        this.dataService.update()
      },
      onCancelClicked: () => {
      }
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  onAusschliessenClicked = (eintragx: EditDialogData) => {
    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === eintragx.id)].data.isExcluded = true;
    this.dataService.update(false);
  }

  onEinschliessenClicked = (eintragx: EditDialogData) => {
    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === eintragx.id)].data.isExcluded = false;
    this.dataService.update(false);
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newFixKostenEintrag: IFixkostenEintrag = {
      id: eintrag.id,
      data: {
        betrag: eintrag.betrag ?? 0,
        title: eintrag.title ?? 'ohne Titel',
        zusatz: eintrag.zusatz
      }
    }

    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === newFixKostenEintrag.id)] = newFixKostenEintrag;
    this.dataService.update();
  }

  onEditCancelClicked = () => {
  }
}
