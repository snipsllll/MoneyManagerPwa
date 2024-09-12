import {Component, computed, OnInit, signal} from '@angular/core';
import {FixKostenEintrag} from "../../../Models/Interfaces";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";

@Component({
  selector: 'app-fix-kosten',
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent  implements OnInit{
  elements = computed(() => {
    this.dataService.updated();
    return this.dataService.userData.fixKosten;
  })
  selectedElement = signal<number>(-1);
  newFixKostenEintrag!: FixKostenEintrag;

  constructor(private dialogService: DialogService, private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      zusatz: ''
    }
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
  }

  getViewModel(eintrag: FixKostenEintrag): ListElementViewModel {
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

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    const newFixkostenEintrag: FixKostenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title ?? 'kein Titel',
      zusatz: eintrag.zusatz
    }
    this.dataService.addFixKostenEintrag(newFixkostenEintrag);
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      zusatz: ''
    }
  }

  onCreateCancelClicked = () => {

  }

  onEditClicked = (eintrag: FixKostenEintrag) => {
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
    this.dataService.deleteFixKostenEintrag(eintrag.id!);
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    console.log(eintrag)
    const newFixKostenEintrag: FixKostenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title ?? 'ohne Titel',
      zusatz: eintrag.zusatz,
      id: eintrag.id
    }

    this.dataService.editFixKostenEintrag(newFixKostenEintrag);
  }

  onEditCancelClicked = () => {}
}
