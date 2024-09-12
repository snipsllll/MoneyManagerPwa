import {Component, OnInit, signal} from '@angular/core';
import {FixKostenEintrag} from "../../../Models/Interfaces";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";

@Component({
  selector: 'app-fix-kosten',
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent  implements OnInit{
  elements = signal<FixKostenEintrag[]>([]);
  selectedElement = signal<number>(-1);
  showCreateDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);
  newFixKostenEintrag!: FixKostenEintrag;

  constructor(private dialogService: DialogService, private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.elements.set(this.dataService.userData.fixKosten);
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: ''
    }
  }

  onPlusClicked() {
    this.showCreateDialog.set(true);
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
          onClick: onEditClicked
        },
        {
          label: 'delete',
          onClick: onDeleteClicked
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

  update() {
    this.elements.set(this.dataService.userData.fixKosten);
  }

  onCreateSpeichernClicked() {
    if(this.darfSpeichern()){
      this.showCreateDialog.set(false);
      this.dataService.addFixKostenEintrag(this.newFixKostenEintrag);
      this.newFixKostenEintrag = {
        title: '',
        betrag: 0,
        beschreibung: ''
      }
    } else {
      this.showBetragWarnung.set(true);
    }
  }

  onCreateAbbrechenClicked() {
    if (this.isEmpty()){
      this.showCreateDialog.set(false);
      return;
    }
    const dialogViewmodel: ConfirmDialogViewModel = {
      title: 'Abbrechen?',
      message: 'Willst du abbrechen? Alle Änderungen werden verworfen!',
      onConfirmClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
        this.showCreateDialog.set(false);
      },
      onCancelClicked: () => {
        this.dialogService.isConfirmDialogVisible = false;
      }
    }
    this.dialogService.showConfirmDialog(dialogViewmodel);
  }

  darfSpeichern() {
    return this.newFixKostenEintrag.betrag !== 0
  }

  isEmpty() {
    return this.newFixKostenEintrag.betrag === 0 && this.newFixKostenEintrag.title === '' && this.newFixKostenEintrag.beschreibung === ''
  }
}

function onEditClicked() {

}

function onDeleteClicked() {

}