import {Component, computed, Input, OnInit} from '@angular/core';
import {IFixkostenEintrag, IFixkostenEintragData, IMonthFixkostenEintrag} from "../../../Models/NewInterfaces";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {DataService} from "../../../Services/DataService/data.service";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../../Models/ViewModels/CreateDialogViewModel";
import {
  ListElementData,
  ListElementSettings,
  ListElementViewModel
} from "../../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../../Models/ViewModels/EditDialogViewModel";
import {ConfirmDialogViewModel} from "../../../Models/ViewModels/ConfirmDialogViewModel";
import {MonatFixkostenDialogViewModel} from "../../../Models/ViewModels/MonatFixkostenDialogViewModel";
import {UT} from "../../../Models/Classes/UT";
import {FixkostenPeriods} from "../../../Models/Enums";

@Component({
  selector: 'app-monat-fixkosten-dialog',
  templateUrl: './monat-fixkosten-dialog.component.html',
  styleUrl: './monat-fixkosten-dialog.component.css'
})
export class MonatFixkostenDialogComponent implements OnInit {
  @Input() viewModel!: MonatFixkostenDialogViewModel;
  summe = computed(() => {
    this.dataService.updated();
    let summe = 0;
    this.viewModel.elemente.forEach(element => {
      if (element.data.isExcluded !== true) {
        summe += element.data.betrag;
      }
    })
    return summe;
  })
  newFixKostenEintrag!: IFixkostenEintragData;
  simulatedId = -1;
  oldElements: IMonthFixkostenEintrag[] = [];
  utils = new UT();

  constructor(private dialogService: DialogService, public dataService: DataService) {
  }

  ngOnInit() {
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: '',
      period: FixkostenPeriods.Month
    }

    this.oldElements = this.utils.clone(this.viewModel.elemente);
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
      this.viewModel.onSaveClicked(this.viewModel);
    }
  }

  checkHasChanged() {
    if(this.oldElements.length !== this.viewModel.elemente.length) {
      return true;
    }

    let hasChanged = false;

    for (let i = 0; i < this.viewModel.elemente.length; i++) {
      if(this.oldElements[i].data.title !== this.viewModel.elemente[i].data.title)
        hasChanged = true;
      if(this.oldElements[i].data.beschreibung !== this.viewModel.elemente[i].data.beschreibung)
        hasChanged = true;
      if(this.oldElements[i].data.betrag !== this.viewModel.elemente[i].data.betrag)
        hasChanged = true;
      if(this.oldElements[i].data.isExcluded !== this.viewModel.elemente[i].data.isExcluded)
        hasChanged = true;
      if(this.oldElements[i].data.isStandardFixkostenEintrag !== this.viewModel.elemente[i].data.isStandardFixkostenEintrag)
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

  getViewModel(eintrag: IMonthFixkostenEintrag): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: true
    }

    const data: ListElementData = {
      id: eintrag.id,
      betrag: eintrag.data.betrag,
      title: eintrag.data.title,
      zusatz: eintrag.data.beschreibung,
      isStandardFixkostenEintrag: eintrag.data.isStandardFixkostenEintrag,
      isExcluded: eintrag.data.isExcluded,
      menuItems: eintrag.data.isStandardFixkostenEintrag
        ? [
          {
            label: 'ausschließen',
            onClick: this.onAusschliessenClicked,
            disabled: eintrag.data.isExcluded
          },
          {
            label: 'einschließen',
            onClick: this.onEinschliessenClicked,
            disabled: !eintrag.data.isExcluded
          }
        ]
        : [
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
    const newFixkostenEintrag: IMonthFixkostenEintrag = {
      id: this.getNextFreeSimulatedId(),
      data: {
        betrag: eintrag.betrag ?? 0,
        title: eintrag.title ?? 'kein Titel',
        beschreibung: eintrag.beschreibung,
        period: eintrag.period ?? FixkostenPeriods.Year,
        abrechnungsmonat: eintrag.selectedAbrechnungsmonat,
        isExcluded: false,
        isStandardFixkostenEintrag: false
      }
    }
    this.viewModel.elemente.push(newFixkostenEintrag);
    this.newFixKostenEintrag = {
      title: '',
      betrag: 0,
      beschreibung: '',
      period: FixkostenPeriods.Month,
      abrechnungsmonat: eintrag.selectedAbrechnungsmonat
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
    this.viewModel.elemente.splice(this.viewModel.elemente.findIndex(eintrag => eintrag.id === x.id), 1);
    this.dataService.update(false);
  }

  onAusschliessenClicked = (eintragx: EditDialogData) => {
    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === eintragx.id)].data.isExcluded = true;
    this.dataService.update(false);
  }

  onEinschliessenClicked = (eintragx: EditDialogData) => {
    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === eintragx.id)].data.isExcluded = false;
    this.dataService.update(false);
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newFixKostenEintrag: IFixkostenEintrag = {
      id: eintrag.id,
      data: {
        betrag: eintrag.betrag ?? 0,
        title: eintrag.title ?? 'ohne Titel',
        beschreibung: eintrag.zusatz,
        period: FixkostenPeriods.Month
      }
    }

    console.log(eintrag)
    console.log(this.viewModel.elemente)

    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === newFixKostenEintrag.id)] = newFixKostenEintrag;
    this.dataService.update();
  }

  onEditCancelClicked = () => {
  }
}
