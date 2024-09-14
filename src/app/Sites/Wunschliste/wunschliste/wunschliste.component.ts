import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {Day, SparschweinEintrag, WunschlistenEintrag} from "../../../Models/Interfaces";
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
    this.wirdGekauftesAusgeblendet();
    return this.getElements(this.selectedFilter());
  })

  wirdGekauftesAusgeblendet = signal<boolean>(false);
  selectedFilter = signal<string>('neuste zuerst');

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

  getElements(selectedFilter?: string) {
    let allElements = this.dataService.userData.wunschlistenEintraege;
    if(this.wirdGekauftesAusgeblendet()){
      allElements = allElements.filter(element => element.gekauft === false);
    }

    switch (selectedFilter) {
      case 'neustes zuerst':
        console.log(1)
        allElements = this.sortByDateDesc(allElements);
        break;
      case 'ältestes zuerst':
        console.log(2)
        allElements = this.sortByDateAsc(allElements);
        break;
      case 'günstigstes zuerst':
        console.log(3)
        allElements = this.sortByBetragAsc(allElements);
        break;
      case 'teuerstes zuerst':
        console.log(4)
        allElements = this.sortByBetragDesc(allElements);
        break;
    }

    return allElements;
  }

  onFilterChanged() {
    console.log(this.selectedFilter)
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
      betrag: eintrag.betrag ?? 0,
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
      betragColor: this.kannKaufen(eintrag) ? Color.green : Color.red,
      isGrayedOut: eintrag.gekauft
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
          onClick: eintrag.gekauft ? this.onZuruecknehmenClicked : this.onHolenClicked,
          grayedOut: eintrag.gekauft ? false : !this.kannKaufen(eintrag)
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
    if(this.kannKaufen(newWunschlistenEintrag)){
      this.dataService.editWunschlistenEintrag(newWunschlistenEintrag);
    }
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

  onGekaufteEintraegeAusblendenClicked() {
    this.wirdGekauftesAusgeblendet.set(!this.wirdGekauftesAusgeblendet());
  }

  private kannKaufen(eintrag: WunschlistenEintrag) {
    return (eintrag.betrag <= this.dataService.getErspartes())
  }

  private sortByDateDesc(allElements: WunschlistenEintrag[]) {
    return allElements.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  private sortByDateAsc(allElements: WunschlistenEintrag[]) {
    return allElements.sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  private sortByBetragDesc(allElements: WunschlistenEintrag[]) {
    return allElements.sort((a, b) => b.betrag - a.betrag);
  }

  private sortByBetragAsc(allElements: WunschlistenEintrag[]) {
    return allElements.sort((a, b) => a.betrag - b.betrag);
  }
}
