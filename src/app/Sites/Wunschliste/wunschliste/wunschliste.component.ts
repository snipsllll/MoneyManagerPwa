import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {DataService} from "../../../Services/DataService/data.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {Color} from "../../../Models/Enums";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {IWunschlistenEintrag, IWunschlistenEintragData} from "../../../Models/NewInterfaces";

@Component({
  selector: 'app-wunschliste',
  templateUrl: './wunschliste.component.html',
  styleUrl: './wunschliste.component.css'
})
export class WunschlisteComponent implements OnInit{

  elements = computed(() => {
    this.dataService.updated();
    this.onFilterChanged();
    this.onGekaufteEintraegeAusblendenChanged();
    this.wirdGekauftesAusgeblendet();
    return this.getElements(this.selectedFilter());
  })

  wirdGekauftesAusgeblendet = signal<boolean>(false);
  selectedFilter = signal<string>('neuste zuerst');

  newWunschlistenEintrag!: IWunschlistenEintragData;

  constructor(private dataChangeService: DataChangeService, private dataProvider: DataProviderService, private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService) {
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
      erstelltAm: new Date()
    }
    //this.selectedFilter.set(this.saveService.getSettings().wunschllistenFilter.selectedFilter ?? '');
    //this.wirdGekauftesAusgeblendet.set(this.saveService.getSettings().wunschllistenFilter.gekaufteEintraegeAusblenden ?? false);
  }

  getElements(selectedFilter?: string) {
    let allElements = this.dataService.userData.wunschlistenEintraege;
    if(this.wirdGekauftesAusgeblendet()){
      allElements = allElements.filter(element => element.data.gekauft === false);
    }

    switch (selectedFilter) {
      case 'neustes zuerst':
        allElements = this.sortByDateDesc(allElements);
        break;
      case 'ältestes zuerst':
        allElements = this.sortByDateAsc(allElements);
        break;
      case 'günstigstes zuerst':
        allElements = this.sortByBetragAsc(allElements);
        break;
      case 'teuerstes zuerst':
        allElements = this.sortByBetragDesc(allElements);
        break;
    }

    return allElements;
  }

  onFilterChanged() {
    /*
    if(this.saveService.getSettings()) {
      let x = this.saveService.getSettings();
      x.wunschllistenFilter.selectedFilter = this.selectedFilter();
      this.saveService.setSettings(x);
    }*/
  }

  onGekaufteEintraegeAusblendenChanged() {
    /*
    if(this.saveService.getSettings()) {
      let x = this.saveService.getSettings();
      x.wunschllistenFilter.gekaufteEintraegeAusblenden = this.wirdGekauftesAusgeblendet();
      this.saveService.setSettings(x);
    }*/
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
  }

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    const newWunschlistenEintrag: IWunschlistenEintragData = {
      betrag: eintrag.betrag ?? 0,
      title: eintrag.title ?? 'kein Titel',
      zusatz: eintrag.zusatz,
      gekauft: false,
      date: new Date(),
      erstelltAm: new Date()
    }
    this.dataChangeService.addWunschlistenEintrag(newWunschlistenEintrag);
    this.newWunschlistenEintrag = {
      title: '',
      betrag: 0,
      zusatz: '',
      date: new Date(),
      gekauft: false,
      erstelltAm: new Date()
    }
  }

  onCreateCancelClicked = () => {

  }

  getViewModel(eintrag: IWunschlistenEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: true,
      betragColor: this.kannKaufen(eintrag) ? Color.green : Color.red,
      isGrayedOut: eintrag.data.gekauft
    }

    const data: ListElementData = {
      betrag: eintrag.data.betrag,
      title: eintrag.data.title,
      zusatz: eintrag.data.zusatz,
      id: eintrag.id,
      date: eintrag.data.date,
      erstelltAm: eintrag.data.erstelltAm,
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
          label: eintrag.data.gekauft ? 'zurücknehmen' : 'holen',
          onClick: eintrag.data.gekauft ? this.onZuruecknehmenClicked : this.onHolenClicked,
          grayedOut: eintrag.data.gekauft ? false : !this.kannKaufen(eintrag)
        }
      ]
    }

    return {
      settings: settings,
      data: data
    }
  }

  onEditClicked = (eintrag: IWunschlistenEintrag) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        betrag: eintrag.data.betrag,
        title: eintrag.data.title,
        zusatz: eintrag.data.zusatz,
        id: eintrag.id,
        erstelltAm: eintrag.data.erstelltAm,
        date: eintrag.data.date
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
        this.dataChangeService.deleteWunschlistenEintrag(eintrag.id!);
      },
      onCancelClicked: () => {}
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newWunschlistenEintrag: IWunschlistenEintrag = {
      id: eintrag.id!,
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title ?? 'ohne Titel',
        zusatz: eintrag.zusatz,
        gekauft: false,
        date: eintrag.date!,
        erstelltAm: eintrag.erstelltAm!
      }
    }

    this.dataChangeService.editWunschlistenEintrag(newWunschlistenEintrag);
  }

  onEditCancelClicked = () => {}

  onHolenClicked = (eintrag: ListElementData) => {
    const newWunschlistenEintrag: IWunschlistenEintrag = {
      id: eintrag.id!,
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title ?? 'ohne Titel',
        zusatz: eintrag.zusatz,
        gekauft: false,
        date: eintrag.date!,
        erstelltAm: eintrag.erstelltAm!
      }
    }
    console.log(newWunschlistenEintrag)
    if(this.kannKaufen(newWunschlistenEintrag)){
      this.dataChangeService.editWunschlistenEintrag(newWunschlistenEintrag);
    }
  }

  onZuruecknehmenClicked = (eintrag: ListElementData) => {
    const newWunschlistenEintrag: IWunschlistenEintrag = {
      id: eintrag.id!,
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title ?? 'ohne Titel',
        zusatz: eintrag.zusatz,
        gekauft: false,
        date: eintrag.date!,
        erstelltAm: eintrag.erstelltAm!
      }
    }
    this.dataChangeService.editWunschlistenEintrag(newWunschlistenEintrag);
  }

  onGekaufteEintraegeAusblendenCheckboxClicked() {
    /*
    if(this.saveService.getSettings()) {
      let x = this.saveService.getSettings();
      x.wunschllistenFilter.gekaufteEintraegeAusblenden = this.wirdGekauftesAusgeblendet();
      this.saveService.setSettings(x);
    }*/
  }

  onGekaufteEintraegeAusblendenLabelClicked() {
    /*
    if(this.saveService.getSettings()) {
      let x = this.saveService.getSettings();
      x.wunschllistenFilter.gekaufteEintraegeAusblenden = this.wirdGekauftesAusgeblendet();
      this.saveService.setSettings(x);
    }*/
  }

  private kannKaufen(eintrag: IWunschlistenEintrag) {
    return (eintrag.data.betrag <= this.dataProvider.getErspartes())
  }

  private sortByDateDesc(allElements: IWunschlistenEintrag[]) {
    return allElements.sort((a, b) => b.data.erstelltAm.getTime() - a.data.erstelltAm.getTime());
  }

  private sortByDateAsc(allElements: IWunschlistenEintrag[]) {
    return allElements.sort((a, b) => a.data.erstelltAm.getTime() - b.data.erstelltAm.getTime());
  }

  private sortByBetragDesc(allElements: IWunschlistenEintrag[]) {
    return allElements.sort((a, b) => b.data.betrag - a.data.betrag);
  }

  private sortByBetragAsc(allElements: IWunschlistenEintrag[]) {
    return allElements.sort((a, b) => a.data.betrag - b.data.betrag);
  }
}
