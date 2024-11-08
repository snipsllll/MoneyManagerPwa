import {Component, computed, OnInit} from '@angular/core';
import {SparschweinEintrag} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {SparschweinService} from "../../../Services/SparschweinService/sparschwein.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {UT} from "../../../Models/Classes/UT";

@Component({
  selector: 'app-sparschwein',
  templateUrl: './sparschwein.component.html',
  styleUrl: './sparschwein.component.css'
})
export class SparschweinComponent implements OnInit{

  ut: UT = new UT();

  sparschweinData = computed(() => {
    this.dataService.updated();
    const x = this.sparschweinService.getData();
    x.eintraege = this.sortByDate(x.eintraege);
    console.log(x);
    return x;
  });

  constructor(private dataService: DataService, private dialogService: DialogService, private topbarService: TopbarService, private sparschweinService: SparschweinService) {

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
        this.sparschweinService.deleteEintrag(eintrag.id!);
      },
      onCancelClicked: () => {}
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  getEintragViewModel(eintrag: SparschweinEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doDetailsExist: false,
      doMenuExist: !(eintrag.isMonatEintrag || eintrag.isWunschlistenEintrag),
      isDarker: eintrag.isMonatEintrag,
    }

    const data: ListElementData = {
      betrag: eintrag.betrag,
      title: this.getTitle(eintrag),
      zusatz: eintrag.zusatz,
      vonHeuteAbziehen: eintrag.vonDayBudgetAbziehen,
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

  private getCreateDialogViewModel(): CreateDialogViewModel {
    return {
      onSaveClick: (eintrag: CreateDialogEintrag) => {
        const newSparschweinEintrag: SparschweinEintrag = {
          betrag: eintrag.betrag ?? 0,
          title: eintrag.title,
          zusatz: eintrag.zusatz,
          isMonatEintrag: false,
          date: new Date(),
          id: -1,
          vonDayBudgetAbziehen: eintrag.vonHeuteAbziehen
        }
        console.log(newSparschweinEintrag)
        this.sparschweinService.addEintrag(newSparschweinEintrag);
      },
      onCancelClick: () => {},
      istVonHeuteAbzeihenVisible: true
    }
  }

  getEditDialogViewModel = (eintrag: EditDialogData): EditDialogViewModel => {
    return {
      data: eintrag,
      onSaveClick: (eintrag: EditDialogData) => {
        this.sparschweinService.editEintrag({
          betrag: eintrag.betrag,
          id: eintrag.id!,
          title: eintrag.title,
          zusatz: eintrag.zusatz,
          date: eintrag.date!,
          vonDayBudgetAbziehen: eintrag.vonHeuteAbziehen
        })
      },
      onCancelClick: () => {

      },
      istVonHeuteAbzeihenVisible: true
    }
  }

  private sortByDate(eintraege: SparschweinEintrag[]) {
    return eintraege.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

}


