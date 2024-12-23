import {Component, computed, Input} from '@angular/core';
import {MonatFixkostenDialogViewModel} from "../../Models/ViewModels/MonatFixkostenDialogViewModel";
import {IFixkostenEintrag, IFixkostenEintragData, IMonthFixkostenEintrag} from "../../Models/NewInterfaces";
import {UT} from "../../Models/Classes/UT";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {ListElementData, ListElementSettings, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {
  ISchuldenPlanEintrag,
  ISchuldenPlanEintragData,
  SchuldenPlanenDialogViewModel
} from "../../Models/ViewModels/SchuldenPlanenDialogViewModel";
import {ISchuldenEintrag} from "../../Models/Interfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";

@Component({
  selector: 'app-schulden-planen-dialog',
  templateUrl: './schulden-planen-dialog.component.html',
  styleUrl: './schulden-planen-dialog.component.css'
})
export class SchuldenPlanenDialogComponent {
  @Input() viewModel!: SchuldenPlanenDialogViewModel;
  summe = computed(() => {
    this.dataService.updated();
    let summe = 0;
    this.viewModel.schuldenPlanEintraege.forEach(element => {
      summe += element.data.betrag;
    })
    return this.viewModel.schuldenbetrag - summe;
  })
  newEintrag!: ISchuldenPlanEintragData;
  simulatedId = -1;
  oldElements: ISchuldenPlanEintrag[] = [];
  utils = new UT();

  constructor(private dataProvider: DataProviderService, private dialogService: DialogService, public dataService: DataService) {
  }

  ngOnInit() {
    this.newEintrag = {
      betrag: 0,
      monatStartDate: new Date()
    }

    this.oldElements = this.utils.clone(this.viewModel.schuldenPlanEintraege);
    console.log(this.viewModel)
  }

  onCancelClicked() {
    if (this.checkHasChanged()) {
      const confirmDialogViewModel: ConfirmDialogViewModel = {
        title: 'Abbrechen?',
        message: 'Willst du wirklich abbrechen? Alle nicht gespeicherten Änderungen werden verworfen!',
        onConfirmClicked: () => {
          this.dialogService.isCreateDialogVisible = false;
          this.viewModel.onAbortClicked();
        },
        onCancelClicked() {
        }
      }
      this.dialogService.showConfirmDialog(confirmDialogViewModel);
    } else {
      this.dialogService.isCreateDialogVisible = false;
      this.viewModel.onAbortClicked();
    }
  }

  onSaveClicked() {
    if (this.checkDarfSpeichern()) {
      this.dialogService.isCreateDialogVisible = false;
      this.viewModel.onSaveClicked(this.viewModel.schuldenPlanEintraege);
    }
  }

  checkHasChanged() {
    if(this.oldElements.length !== this.viewModel.schuldenPlanEintraege.length) {
      return true;
    }

    let hasChanged = false;

    for (let i = 0; i < this.viewModel.schuldenPlanEintraege.length; i++) {
      if(this.oldElements[i].data.betrag !== this.viewModel.schuldenPlanEintraege[i].data.betrag)
        hasChanged = true;
      if(this.oldElements[i].data.monatStartDate.toLocaleDateString() !== this.viewModel.schuldenPlanEintraege[i].data.monatStartDate.toLocaleDateString())
        hasChanged = true;
    }

    return hasChanged;
  }

  checkDarfSpeichern() {
    return this.checkHasChanged();
  }

  onPlusClicked() {
    const createDialogViewModel: CreateDialogViewModel = {
      onSaveClick: this.onCreateSaveClicked,
      onCancelClick: this.onCreateCancelClicked
    }
    this.dialogService.showCreateDialog(createDialogViewModel);
  }

  getViewModel(eintrag: ISchuldenPlanEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: true
    }

    const data: ListElementData = {
      id: eintrag.id,
      betrag: eintrag.data.betrag,
      title: 'Titel muss noch (ToDo)',
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
    const newSchuldenPlanEintrag: ISchuldenPlanEintrag = {
      id: this.getNextFreeSimulatedId(),
      data: {
        betrag: eintrag.betrag ?? 0,
        monatStartDate: eintrag.date!
      }
    }
    this.viewModel.schuldenPlanEintraege.push(newSchuldenPlanEintrag);
    this.newEintrag = {
      betrag: 0,
      monatStartDate: new Date()
    }
    this.dataService.update()
  }

  getNextFreeSimulatedId() {
    this.simulatedId--;
    return this.simulatedId;
  }

  getNextFreeSpecialFixkostenEintragId() {
    let freeId = 1;
    for (let i = 0; i < this.dataService.userData.geplanteAusgabenBuchungen.length; i++) {
      if (this.dataService.userData.geplanteAusgabenBuchungen.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
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

  onDeleteClicked = (x: EditDialogData) => {
    this.viewModel.schuldenPlanEintraege.splice(this.viewModel.schuldenPlanEintraege.findIndex(eintrag => eintrag.id === x.id), 1);
    this.dataService.update(false);
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newEintrag: ISchuldenPlanEintrag = {
      id: eintrag.id,
      data: {
        betrag: eintrag.betrag ?? 0,
        monatStartDate: eintrag.date!
      }
    }

    console.log(eintrag)
    console.log(this.viewModel.schuldenPlanEintraege)

    this.viewModel.schuldenPlanEintraege[this.viewModel.schuldenPlanEintraege.findIndex(eintrag => eintrag.id === newEintrag.id)] = newEintrag;
    this.dataService.update();
  }

  onEditCancelClicked = () => {
  }
}
