import {Component, computed, OnInit} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {ISchuldenEintrag, ISchuldenEintragData} from "../../Models/Interfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {ListElementData, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {IFixkostenEintrag, IFixkostenEintragData} from "../../Models/NewInterfaces";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {ZahlungDialogViewModel} from "../../Models/Auswertungen-Interfaces";
import {DataService} from "../../Services/DataService/data.service";

@Component({
  selector: 'app-schulden',
  templateUrl: './schulden.component.html',
  styleUrl: './schulden.component.css'
})
export class SchuldenComponent implements OnInit{
  elements = computed(() => {
    this.dataService.updated();
    const x = this.dataService.userData.schuldenEintraege;
    this.updateSchulden(x);
    return x;
  })
  summe = 0;

  constructor(private dataService: DataService, private topbarService: TopbarService, private dataChangeService: DataChangeService, private dataProvider: DataProviderService, public dialogService: DialogService) {
  }

  ngOnInit() {
    this.topbarService.title.set('SCHULDEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
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

  onSchuldenEintragEditClicked = (eintrag: ListElementData) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        betrag: eintrag.betrag,
        title: eintrag.title,
        zusatz: eintrag.zusatz,
        id: eintrag.id!
      },
      onSaveClick: this.onEditSaveClicked,
      onCancelClick: this.onEditCancelClicked
    }
    this.dialogService.showEditDialog(editDialogViewModel);
  }

  onSchuldenEintragPlanClicked = (data: ListElementData) => {
    console.log('plan clicked', data)
  }

  onSchuldenEintragBezahlenClicked = (data: ListElementData) => {
    console.log('bezahlen clicked', data);
    const zahlungsDialogViewModel: ZahlungDialogViewModel = {
      zuZahlenderBetrag: data.betrag!,
      onAbortClicked: this.onZahlungDialogAbortClicked,
      onSaveClicked: this.onZahlungDialogSaveClicked,
      eintrag: data
    }

    this.dialogService.showZahlungDialog(zahlungsDialogViewModel);
  }

  onZahlungDialogSaveClicked = (data: ListElementData) => {
    console.log(data)
    const newSchuldenEintrag: ISchuldenEintrag = {
      id: data.id!,
      data: {
        betrag: data.betrag!,
        title: data.title!,
        beschreibung: data.zusatz ?? ''
      }
    }
    this.dataChangeService.editSchuldenEintrag(newSchuldenEintrag)
    this.dialogService.isZahlungDialogVisible = false;
  }

  onZahlungDialogAbortClicked = (data: ListElementData) => {
    this.dialogService.isZahlungDialogVisible = false;
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



  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newSchuldenEintrag: ISchuldenEintrag = {
      id: eintrag.id,
      data: {
        betrag: eintrag.betrag ?? 0,
        title: eintrag.title ?? 'ohne Titel',
        beschreibung: eintrag.zusatz
      }
    }

    this.dataChangeService.editSchuldenEintrag(newSchuldenEintrag);
  }

  onEditCancelClicked = () => {}

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    const newSchuldenEintragData: ISchuldenEintragData = {
      betrag: eintrag.betrag ?? 0,
      title: eintrag.title ?? 'kein Titel',
      beschreibung: eintrag.beschreibung
    }
    this.dataChangeService.addSchuldenEintrag(newSchuldenEintragData);
  }

  onCreateCancelClicked = () => {

  }
  private updateSchulden(eintraege: ISchuldenEintrag[]) {
    this.summe = 0;
    eintraege.forEach(eintrag => {
      this.summe += eintrag.data.betrag;
    })
  }

}
