import {Component, computed, OnInit} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {SparschweinEintrag, WunschlistenEintrag} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {Color} from "../../../Models/Enums";
import {SparschweinService} from "../../../Services/SparschweinService/sparschwein.service";

@Component({
  selector: 'app-wunschliste',
  templateUrl: './wunschliste.component.html',
  styleUrl: './wunschliste.component.css'
})
export class WunschlisteComponent implements OnInit{

  elements = computed(() => {
    this.dataService.updated();
    return this.dataService.userData.wunschlistenEintraege
  })

  newWunschlistenEintrag!: WunschlistenEintrag;

  constructor(private sparschweinService: SparschweinService, private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('WUNSCHLISTE');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.newWunschlistenEintrag = {
      title: '',
      betrag: 0,
      zusatz: '',
      date: new Date(),
      gekauft: false,
    }
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
  }

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    const newWunschlistenEintrag: WunschlistenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title ?? 'kein Titel',
      zusatz: eintrag.zusatz,
      gekauft: false,
      date: new Date()
    }
    this.dataService.addWunschlistenEintrag(newWunschlistenEintrag);
    this.newWunschlistenEintrag = {
      title: '',
      betrag: 0,
      zusatz: '',
      date: new Date(),
      gekauft: false,
    }
  }

  onCreateCancelClicked = () => {

  }

  getViewModel(eintrag: WunschlistenEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: true,
      highlighted: this.kannKaufen(eintrag) && !eintrag.gekauft,
      betragColor: this.kannKaufen(eintrag) ? Color.green : Color.red,
      isDarker: eintrag.gekauft
    }

    const data: ListElementData = {
      betrag: eintrag.betrag,
      title: eintrag.title,
      zusatz: eintrag.zusatz,
      id: eintrag.id,
      date: eintrag.date,
      menuItems: [
        {
          label: 'bearbeiten',
          onClick: this.onEditClicked
        },
        {
          label: 'löschen',
          onClick: this.onDeleteClicked
        },
        {
          label: eintrag.gekauft ? 'zurücknehmen' : 'holen',
          onClick: eintrag.gekauft ? this.onZuruecknehmenClicked : this.onHolenClicked
        }
      ]
    }

    return {
      settings: settings,
      data: data
    }
  }

  onEditClicked = (eintrag: WunschlistenEintrag) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title,
        zusatz: eintrag.zusatz,
        id: eintrag.id
      },
      onSaveClick: this.onEditSaveClicked,
      onCancelClick: this.onEditCancelClicked
    }
    this.dialogService.showEditDialog(editDialogViewModel);
  }

  onDeleteClicked = (eintrag: EditDialogData) => {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dataService.deleteWunschlistenEintrag(eintrag.id!);
      },
      onCancelClicked: () => {}
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newWunschlistenEintrag: WunschlistenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title ?? 'ohne Titel',
      zusatz: eintrag.zusatz,
      id: eintrag.id,
      gekauft: false,
      date: eintrag.date!
    }

    this.dataService.editWunschlistenEintrag(newWunschlistenEintrag);
  }

  onEditCancelClicked = () => {}

  onHolenClicked = (eintrag: ListElementData) => {
    const newWunschlistenEintrag: WunschlistenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title,
      gekauft: true,
      gekauftAm: new Date(),
      id: eintrag.id,
      date: eintrag.date!,
      zusatz: eintrag.zusatz
    }
    this.dataService.editWunschlistenEintrag(newWunschlistenEintrag);
  }

  onZuruecknehmenClicked = (eintrag: ListElementData) => {
    const newWunschlistenEintrag: WunschlistenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title,
      gekauft: false,
      gekauftAm: undefined,
      id: eintrag.id,
      date: eintrag.date!,
      zusatz: eintrag.zusatz
    }
    this.dataService.editWunschlistenEintrag(newWunschlistenEintrag);
  }

  private kannKaufen(eintrag: WunschlistenEintrag) {
    return (eintrag.betrag <= this.dataService.getErspartes())
  }
}
