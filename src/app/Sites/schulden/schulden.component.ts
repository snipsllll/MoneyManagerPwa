import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {ISchuldenEintrag} from "../../Models/Interfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {ListElementData, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";

@Component({
  selector: 'app-schulden',
  templateUrl: './schulden.component.html',
  styleUrl: './schulden.component.css'
})
export class SchuldenComponent implements OnInit{

  schuldenEintraege: ISchuldenEintrag[] = [];

  constructor(private topbarService: TopbarService, private dataChangeService: DataChangeService, private dataProvider: DataProviderService, public dialogService: DialogService) {
  }

  ngOnInit() {
    this.topbarService.title.set('SCHULDEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;

    this.schuldenEintraege = this.dataProvider.getAlleSchuldenEintraege();
  }

  onPlusClicked() {
    this.dataChangeService.addSchuldenEintrag({
      betrag: 12,
      title: ''
    })
  }

  protected getListElemViewModelForSchuldenEintrag(schuldenEintrag: ISchuldenEintrag): ListElementViewModel {
    return {
      data: {
        betrag: schuldenEintrag.data.betrag,
        id: schuldenEintrag.id,
        title: schuldenEintrag.data.title,
        zusatz: schuldenEintrag.data.beschreibung,
        onEintragClicked: this.onSchuldenEintragClicked,
        menuItems: [
          {
            label: 'bearbeiten',
            isEditButton: true,
            onClick: this.onSchuldenEintragEditClicked
          },
          {
            label: 'planen',
            isEditButton: true,
            onClick: this.onSchuldenEintragPlanClicked
          },
          {
            label: 'bezahlen',
            isEditButton: true,
            onClick: this.onSchuldenEintragBezahlenClicked
          },
          {
            label: 'löschen',
            isEditButton: true,
            onClick: this.onSchuldenEintragDeleteClicked
          }
        ]
      },
      settings: {
        doMenuExist: true,
        doDetailsExist: false
      }
    }
  }

  onSchuldenEintragClicked = (data: ListElementData) => {
    console.log('eintrag clicked', data)
  }

  onSchuldenEintragEditClicked = (data: ListElementData) => {
    console.log('edit clicked', data)
  }

  onSchuldenEintragPlanClicked = (data: ListElementData) => {
    console.log('plan clicked', data)
  }

  onSchuldenEintragBezahlenClicked = (data: ListElementData) => {
    console.log('bezahlen clicked', data)
  }

  onSchuldenEintragDeleteClicked = (data: ListElementData) => {
    if(!data.id)
      throw new Error('id was not found')

    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dataChangeService.deleteSchuldenEintrag(data.id!);
      },
      onCancelClicked: () => {}
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

}
