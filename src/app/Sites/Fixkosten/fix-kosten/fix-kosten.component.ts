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
      beschreibung: ''
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
      details: eintrag.beschreibung,
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

  onElementClicked(eintragId: number) {
    if(this.selectedElement() === eintragId){
      this.selectedElement.set(-1)
    } else {
      this.selectedElement.set(eintragId);
    }
  }

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    const newFixkostenEintrag: FixKostenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title ?? 'kein Titel',
      beschreibung: eintrag.zusatz
    }
    this.dataService.addFixKostenEintrag(newFixkostenEintrag);
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: ''
    }
  }

  onCreateCancelClicked = () => {

  }

  onEditClicked = (eintrag: FixKostenEintrag) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title,
        zusatz: eintrag.beschreibung,
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
    const newFixKostenEintrag: FixKostenEintrag = {
      betrag: eintrag.betrag,
      title: eintrag.title ?? 'ohne Titel',
      beschreibung: eintrag.zusatz,
      id: eintrag.id
    }

    this.dataService.editFixKostenEintrag(newFixKostenEintrag);
  }

  onEditCancelClicked = () => {}
}
