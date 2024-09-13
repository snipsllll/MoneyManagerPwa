import {Component, computed, OnInit} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {WunschlistenEintrag} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";

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

  constructor(private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService) {
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
    }

    const data: ListElementData = {
      betrag: eintrag.betrag,
      title: eintrag.title,
      zusatz: eintrag.zusatz,
      id: eintrag.id,
      menuItems: [
        {
          label: 'bearbeiten',
          onClick: this.onEditClicked
        },
        {
          label: 'delete',
          onClick: this.onDeleteClicked
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
    this.dataService.deleteWunschlistenEintrag(eintrag.id!);
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
}
