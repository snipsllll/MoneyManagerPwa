import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {ISchuldenEintrag} from "../../Models/Interfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {ListElementData, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";

@Component({
  selector: 'app-schulden',
  templateUrl: './schulden.component.html',
  styleUrl: './schulden.component.css'
})
export class SchuldenComponent implements OnInit{

  schuldenEintraege: ISchuldenEintrag[] = [];

  constructor(private topbarService: TopbarService, private dataChangeService: DataChangeService, private dataProvider: DataProviderService) {
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
            label: 'löschen',
            isEditButton: true,
            onClick: this.onSchuldenEintragDeleteClicked
          },
        ]
      },
      settings: {
        doMenuExist: true,
        doDetailsExist: false
      }
    }
  }

  private onSchuldenEintragClicked(data: ListElementData) {
    console.log('eintrag clicked', data)
  }

  private onSchuldenEintragEditClicked(data: ListElementData) {
    console.log('edit clicked', data)
  }

  private onSchuldenEintragPlanClicked(data: ListElementData) {
    console.log('plan clicked', data)
  }

  private onSchuldenEintragDeleteClicked(data: ListElementData) {
    console.log('delete clicked', data)
  }

}
