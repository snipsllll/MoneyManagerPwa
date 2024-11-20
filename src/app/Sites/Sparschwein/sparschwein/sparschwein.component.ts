import {Component, computed, OnInit} from '@angular/core';
import {DataService} from "../../../Services/DataService/data.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../../Models/Classes/UT";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";
import {ISparschweinEintrag, ISparschweinEintragData} from "../../../Models/NewInterfaces";

@Component({
  selector: 'app-sparschwein',
  templateUrl: './sparschwein.component.html',
  styleUrl: './sparschwein.component.css'
})
export class SparschweinComponent implements OnInit{

  ut: UT = new UT();

  sparschweinData = computed(() => {
    this.dataService.updated();
    let eintraege = this.dataProvider.getAlleSparschweinEintraege();
    eintraege = this.sortByDate(eintraege);
    let erspartes = this.dataProvider.getErspartes();
    return {
      eintraege: eintraege,
      erspartes: erspartes
    };
  });

  constructor(private dataProvider: DataProviderService, private dataChangeService: DataChangeService, private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService) {

  }

  ngOnInit() {
    this.topbarService.title.set('SPARSCHWEIN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {
    this.dialogService.showCreateDialog(this.getCreateDialogViewModel())
  }

  onEditClicked = (eintrag: EditDialogData) => {
    console.log(eintrag)
    const x: EditDialogData = {
      title: eintrag.title,
      zusatz: eintrag.zusatz,
      date: eintrag.date,
      id: eintrag.id,
      betrag: eintrag.betrag,
      vonHeuteAbziehen: eintrag.vonHeuteAbziehen
    }
    this.dialogService.showEditDialog(this.getEditDialogViewModel(x))
  }

  onDeleteClicked = (eintrag: EditDialogData) => {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dataChangeService.deleteSparschweinEintrag(eintrag.id!);
      },
      onCancelClicked: () => {}
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  getEintragViewModel(eintrag: ISparschweinEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doDetailsExist: false,
      doMenuExist: true,
      isDarker: false
    }

    const data: ListElementData = {
      betrag: eintrag.data.betrag,
      title: this.getTitle(eintrag),
      zusatz: eintrag.data.zusatz,
      vonHeuteAbziehen: false,
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
      data: data,
      settings: settings
    }
  }

  private getTitle(eintrag: ISparschweinEintrag) {
    const art = eintrag.data.betrag > 0 ? 'Einzahlung' : 'Auszahlung';
    const title = eintrag.data.title !== undefined && eintrag.data.title !== '' ? eintrag.data.title : art;
    return `${title} (${eintrag.data.date.toLocaleDateString()})`;
    /*
    if(!eintrag.isMonatEintrag) {
      const art = eintrag.betrag > 0 ? 'Einzahlung' : 'Auszahlung';
      const title = eintrag.title !== undefined && eintrag.title !== '' ? eintrag.title : art;
      return `${title} (${eintrag.date.toLocaleDateString()})`;
    }
    return `Restgeld: ${this.getMonthNameByIndex(eintrag.date.getMonth())} ${eintrag.date.getFullYear()}`*/
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

  private getCreateDialogViewModel(): CreateDialogViewModel {
    return {
      onSaveClick: (eintrag: CreateDialogEintrag) => {
        const newSparschweinEintrag: ISparschweinEintragData = {
          betrag: eintrag.betrag ?? 0,
          title: eintrag.title ?? 'unbenannt',
          zusatz: eintrag.zusatz,
          date: new Date()
        }
        this.dataChangeService.addSparschweinEintrag(newSparschweinEintrag);
      },
      onCancelClick: () => {},
      istVonHeuteAbzeihenVisible: true
    }
  }

  getEditDialogViewModel = (eintrag: EditDialogData): EditDialogViewModel => {
    return {
      data: eintrag,
      onSaveClick: (eintrag: EditDialogData) => {
        this.dataChangeService.editSparschweinEintrag({
          id: eintrag.id!,
          data: {
            betrag: eintrag.betrag,
            title: eintrag.title ?? 'unbenannt',
            zusatz: eintrag.zusatz,
            date: eintrag.date!
          }
        })
      },
      onCancelClick: () => {

      },
      istVonHeuteAbzeihenVisible: true
    }
  }

  private sortByDate(eintraege: ISparschweinEintrag[]) {
    return eintraege.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  }

}


