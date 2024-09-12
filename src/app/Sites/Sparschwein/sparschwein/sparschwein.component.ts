import {Component, computed, OnInit, signal} from '@angular/core';
import {SparschweinEintrag} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {SparschweinService} from "../../../Services/SparschweinService/sparschwein.service";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";

@Component({
  selector: 'app-sparschwein',
  templateUrl: './sparschwein.component.html',
  styleUrl: './sparschwein.component.css'
})
export class SparschweinComponent implements OnInit{

  showCreateDialog = signal<boolean>(false);
  showBetragWarnung = signal<boolean>(false);
  newSpareintrag: SparschweinEintrag = {
    betrag: 0,
    date: new Date(),
    id: 1,
    zusatz: '',
    title: '',
  };

  sparschweinData = computed(() => {
    this.dataService.updated();
    return this.sparschweinService.getData();
  });

  constructor(private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService, private sparschweinService: SparschweinService) {

  }

  ngOnInit() {
    this.topbarService.title.set('SPARSCHWEIN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {
    console.log(2341231)
    this.showCreateDialog.set(true);
  }

  onCreateSpeichernClicked() {
    if(this.darfSpeichern()){
      this.showCreateDialog.set(false);
      this.sparschweinService.addEintrag(this.newSpareintrag);
      this.newSpareintrag = {
        date: new Date(),
        betrag: 0,
        id: -1,
        isMonatEintrag: false
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
    return this.newSpareintrag.betrag !== 0
  }

  isEmpty() {
    return this.newSpareintrag.betrag === 0 && this.newSpareintrag.title === '' && this.newSpareintrag.zusatz === ''
  }

  getEintragViewModel(eintrag: SparschweinEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doDetailsExist: false,
      doMenuExist: !eintrag.isMonatEintrag
    }

    const data: ListElementData = {
      betrag: eintrag.betrag,
      title: this.getTitle(eintrag),
      zusatz: eintrag.zusatz,
      menuItems: [
        {
          label: 'bearbeiten',
          onClick: onEditClicked
        },
        {
          label: 'löschen',
          onClick: onDeleteClicked
        }
      ]
    }

    return {
      data: data,
      settings: settings
    }
  }

  private getTitle(eintrag: SparschweinEintrag) {
    if(!eintrag.isMonatEintrag) {
      const art = eintrag.betrag > 0 ? 'Einzahlung' : 'Auszahlung';
      const title = eintrag.title !== undefined && eintrag.title !== '' ? eintrag.title : art;
      return `${title} (${eintrag.date.toLocaleDateString()})`;
    }
    return `Restgeld: ${this.getMonthNameByIndex(eintrag.date.getMonth())} ${eintrag.date.getFullYear()}`
  }

  private getMonthNameByIndex(index: number) {
    switch(index){
      case 0:
        return 'Januar';
      case 1:
        return 'Februar';
      case 2:
        return 'März';
      case 3:
        return 'April';
      case 4:
        return 'Mai';
      case 5:
        return 'Juni';
      case 6:
        return 'Juli';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'Oktober';
      case 10:
        return 'November';
      case 11:
        return 'Dezember';
    }
    return '';
  }
}


function onEditClicked() {
  console.log('Edit was clicked')
}

function onDeleteClicked() {
  console.log('Delete was clicked')
}
