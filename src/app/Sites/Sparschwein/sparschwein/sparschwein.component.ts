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
    const x: EditDialogData = {
      title: eintrag.title,
      zusatz: eintrag.zusatz,
      date: eintrag.date,
      id: eintrag.id,
      betrag: eintrag.betrag
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
      doDetailsExist: true,
      doMenuExist: !eintrag.data.vonWunschliste && !eintrag.data.vonMonat,
      isDarker: eintrag.data.vonWunschliste || eintrag.data.vonMonat
    }

    const data: ListElementData = {
      id: eintrag.id,
      betrag: eintrag.data.betrag,
      title: eintrag.data.title ?? '',
      zusatz: eintrag.data.zusatz,
      date: eintrag.data.date,
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

  private getCreateDialogViewModel(): CreateDialogViewModel {
    return {
      onSaveClick: (eintrag: CreateDialogEintrag) => {
        const newSparschweinEintrag: ISparschweinEintragData = {
          betrag: eintrag.betrag ?? 0,
          title: eintrag.title,
          zusatz: eintrag.beschreibung,
          date: new Date()
        }
        this.dataChangeService.addSparschweinEintrag(newSparschweinEintrag);
      },
      onCancelClick: () => {}
    }
  }

  getEditDialogViewModel = (eintrag: EditDialogData): EditDialogViewModel => {
    return {
      data: eintrag,
      onSaveClick: (eintrag: EditDialogData) => {
        const editedSparschweinEintrag = {
          id: eintrag.id!,
          data: {
            betrag: eintrag.betrag ?? 0,
            title: eintrag.title,
            zusatz: eintrag.zusatz,
            date: eintrag.date!
          }
        };
        this.dataChangeService.editSparschweinEintrag(editedSparschweinEintrag)
      },
      onCancelClick: () => {

      }
    }
  }

  private sortByDate(eintraege: ISparschweinEintrag[]) {
    console.log(eintraege)
    return eintraege.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  }

}


