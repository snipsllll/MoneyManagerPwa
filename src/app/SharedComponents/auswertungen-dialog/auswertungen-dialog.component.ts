import {Component, Input, signal} from '@angular/core';
import {BuchungsKategorienDialogViewModel} from "../../Models/ViewModels/BuchungsKategorienDialogViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {CreateDialogEintrag, CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {ListElementData, ListElementSettings, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {EditDialogData, EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {IAuswertungsLayout, IAuswertungsLayoutData} from "../../Models/NewInterfaces";
import {AuswertungenDialogViewModel} from "../../Models/ViewModels/AuswertungenDialogViewModel";
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";

@Component({
  selector: 'app-auswertungen-dialog',
  templateUrl: './auswertungen-dialog.component.html',
  styleUrl: './auswertungen-dialog.component.css'
})
export class AuswertungenDialogComponent {
  @Input() viewModel!: AuswertungenDialogViewModel;
  isCreateLayoutDiologVisible = signal<boolean>(false);
  emptyCreateLayoutDialogViewModel = {
    title: '',
    diagramme: undefined
  }

  constructor(private dataChangeService: DataChangeService, private dialogService: DialogService, public dataService: DataService) {
  }

  onCreateDialogSaveClicked(createLayoutViewModel: CreateAuswertungsLayoutDialogViewModel) {
    const newLayoutData: IAuswertungsLayoutData = {
      titel: createLayoutViewModel.title ?? '',
      diagramme: createLayoutViewModel.diagramme!.map((diagram) => ({
        title: diagram.title ?? '',
        filter: [],
        barColor: diagram.color ?? 'red',
        eintragBeschreibung: '',
        valueOption: this.getWertWertByString(diagram.wert),
        xAchsenSkalierung: this.getXAchsenWertByString(diagram.xAchse),
      }))
    }
    const newLayout: IAuswertungsLayout = {
      id: this.getNextFreeAuswertungsLayoutId(),
      data: newLayoutData
    }
    this.viewModel.elemente.push(newLayout);
    this.isCreateLayoutDiologVisible.set(false);
  }

  getWertWertByString(value: any): number {
    switch(value) {
      case  'Restgeld':
        return 0
        break;
      case  'Ausgaben':
        return 1
        break;
      case  'Sparen':
        return 2
        break;
      case  'TotalBudget':
        return 3
        break;
      case  'DifferenzZuDaySollBudget':
        return 4
        break;
    }
    return -1
  }

  getXAchsenWertByString(value: any): number {
    switch(value) {
      case  'alleMonateImJahr':
        return 0
        break;
      case  'alleTageImMonat':
        return 1
        break;
    }
    return -1
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
      this.viewModel.onSaveClicked(this.viewModel.elemente);
    }
  }

  checkHasChanged() {
    return true;
  }

  checkDarfSpeichern() {
    return true;
  }

  onPlusClicked() {
    this.isCreateLayoutDiologVisible.set(true);
  }

  getViewModel(eintrag: IAuswertungsLayout): ListElementViewModel {
    const settings: ListElementSettings = {
      doMenuExist: true,
      doDetailsExist: false
    }

    const data: ListElementData = {
      id: eintrag.id,
      title: eintrag.data.titel,
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
    console.log(eintrag)
    const newEintrag: IAuswertungsLayout = {
      id: 0,
      data: {
        titel: '',
        diagramme: [

        ]
      }
    }
    this.viewModel.elemente.push(newEintrag);
    console.log(this.viewModel)
  }

  onCreateCancelClicked = () => {

  }

  onEditClicked = (eintrag: ListElementData) => {
    const editDialogViewModel: EditDialogViewModel = {
      data: {
        title: eintrag.title,
        id: eintrag.id!
      },
      onSaveClick: this.onEditSaveClicked,
      onCancelClick: this.onEditCancelClicked,
      isZusatzAusgeblendet: true,
      isBetragAusgeblendet: true
    }
    this.dialogService.showEditDialog(editDialogViewModel);
  }

  onDeleteClicked = (x: EditDialogData) => {
    const confirmDialogViewModel: ConfirmDialogViewModel = {
      title: 'Eintrag Löschen?',
      message: 'Wollen Sie den Eintrag wirklich löschen? Der Eintrag Kann nicht wieder hergestellt werden!',
      onConfirmClicked: () => {
        this.viewModel.elemente.splice(this.viewModel.elemente.findIndex(eintrag => eintrag.id === x.id), 1);
      },
      onCancelClicked: () => {
      }
    }

    this.dialogService.showConfirmDialog(confirmDialogViewModel)
  }

  onEditSaveClicked = (eintrag: EditDialogData) => {
    const newEintrag: IAuswertungsLayout = {
      id: eintrag.id,
      data: {
        titel: '',
        diagramme: [

        ]
      }
    }

    this.viewModel.elemente[this.viewModel.elemente.findIndex(eintrag => eintrag.id === newEintrag.id)] = newEintrag;
  }

  onEditCancelClicked = () => {
  }

  private getNextFreeAuswertungsLayoutId() {
    let freeId = 1;
    for (let i = 0; i < this.viewModel.elemente!.length; i++) {
      if (this.viewModel.elemente!.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getEnumValueByKey(enumKey: string, enumObj: any): number | undefined {
    // Überprüft, ob der Schlüssel existiert
    if (enumKey in enumObj) {
      return enumObj[enumKey as keyof typeof enumObj];
    }
    return undefined; // Falls der Schlüssel ungültig ist
  }
}
