import {Component, computed, OnInit, signal} from '@angular/core';
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {IFixkostenEintrag, IFixkostenEintragData} from "../../../Models/NewInterfaces";
import {FixkostenPeriods} from "../../../Models/Enums";

@Component({
  selector: 'app-fix-kosten',
  templateUrl: './fix-kosten.component.html',
  styleUrl: './fix-kosten.component.css'
})
export class FixKostenComponent  implements OnInit{
  elements = computed(() => {
    this.dataService.updated();
    return this.dataService.userData.standardFixkostenEintraege;
  })
  summe = computed(() => {
    this.dataService.updated();
    let summe = 0;
    if(this.elements()) {
      this.elements().forEach(element => {
        summe += element.data.betrag;
      })
    }
    return summe;
  })
  selectedPeriod = signal<FixkostenPeriods>(FixkostenPeriods.Month);
  selectedElements = computed(() => {
    this.selectedPeriod();
    return this.elements().filter(element => element.data.period === this.selectedPeriod());
  });
  newFixKostenEintrag!: IFixkostenEintragData;

  constructor(private dataChangeService: DataChangeService, private dataProvider: DataProviderService, private dialogService: DialogService, private topbarService: TopbarService, public dataService: DataService) {
  }

  ngOnInit() {
    this.topbarService.title.set('FIX KOSTEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: '',
      period: this.selectedPeriod()
    }
  }

  onMonthClicked() {
    this.selectedPeriod.set(FixkostenPeriods.Month);
  }

  onYearClicked() {
    this.selectedPeriod.set(FixkostenPeriods.Year);
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
  }

  getViewModel(eintrag: IFixkostenEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: true,
    }

    const data: ListElementData = {
      id: eintrag.id,
      betrag: eintrag.data.betrag,
      title: eintrag.data.title,
      zusatz: eintrag.data.beschreibung,
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
      settings: settings,
      data: data
    }
  }

  onCreateSaveClicked = (eintrag: CreateDialogEintrag) => {
    const newFixkostenEintrag: IFixkostenEintragData = {
      betrag: eintrag.betrag ?? 0,
      title: eintrag.title ?? 'kein Titel',
      beschreibung: eintrag.beschreibung,
      period: this.selectedPeriod()
    }
    this.dataChangeService.addFixkostenEintrag(newFixkostenEintrag);
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: '',
      period: this.selectedPeriod()
    }
  }

  onCreateCancelClicked = () => {

  }

  onEditClicked = (eintrag: ListElementData) => {
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

  onDeleteClicked = (eintrag: EditDialogData) => {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.dataChangeService.deleteFixkostenEintrag(eintrag.id!);
      },
      onCancelClicked: () => {}
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newFixKostenEintrag: IFixkostenEintrag = {
      id: eintrag.id,
      data: {
        betrag: eintrag.betrag ?? 0,
        title: eintrag.title ?? 'ohne Titel',
        beschreibung: eintrag.zusatz,
        period: this.selectedPeriod()
      }
    }

    this.dataChangeService.editFixkostenEintrag(newFixKostenEintrag);
  }

  onEditCancelClicked = () => {}

  protected readonly FixkostenPeriods = FixkostenPeriods;
}
