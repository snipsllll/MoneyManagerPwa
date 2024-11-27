import {Component, Input, signal} from '@angular/core';
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {CreateDialogEintrag} from "../../Models/ViewModels/CreateDialogViewModel";
import {ListElementData, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {EditDialogData} from "../../Models/ViewModels/EditDialogViewModel";
import {IAuswertungsLayout, IAuswertungsLayoutData} from "../../Models/NewInterfaces";
import {AuswertungenDialogViewModel} from "../../Models/ViewModels/AuswertungenDialogViewModel";
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {DiagramDetailsViewModel} from "../../Models/ViewModels/DiagramDetailsViewModel";
import {XAchsenSkalierungsOptionen} from "../../Models/Enums";

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

  selectedLayout?: IAuswertungsLayout;
  createMode: boolean = false;
  selectedElementToEdit?: CreateAuswertungsLayoutDialogViewModel;

  constructor(private dataProvider: DataProviderService, private dataChangeService: DataChangeService, private dialogService: DialogService, public dataService: DataService) {
  }

  onCreateDialogSaveClicked(createLayoutViewModel: CreateAuswertungsLayoutDialogViewModel) {
    const newLayoutData: IAuswertungsLayoutData = {
      titel: createLayoutViewModel.title ?? '',
      diagramme: createLayoutViewModel.diagramme!.map((diagram) => ({
        title: diagram.title ?? '',
        filter: [{
          filter: this.getFilterWertByString(diagram.filter.filter),
          value: diagram.filter.filter === 'Wochentag' ? this.getWochentagWertByString(diagram.filter.value) : this.getKategorieWertByString(diagram.filter.value)
        }],
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

  getKategorieWertByString(value: any) {
    const kategorien = this.dataProvider.getBuchungsKategorien();
    const foundItem = kategorien.find(item => item.name === value);
    return foundItem ? foundItem.id : -1;
  }

  getFilterWertByString(value: any): number {
    switch (value) {
      case 'Kategorien':
        return 0;
        break;
      case 'Wochentag':
        return 1;
        break;
    }
    return -1;
  }


  getWochentagWertByString(value: string): number {
    switch (value) {
      case 'Sonntag':
        return 0;
        break;
      case 'Montag':
        return 1;
        break;
      case 'Dienstag':
        return 2;
        break;
      case 'Mitwoch':
        return 3;
        break;
      case 'Donnerstag':
        return 4;
        break;
      case 'Freitag':
        return 5;
        break;
      case 'Samstag':
        return 6;
        break;
    }

    return -1;
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

  getStringByFilterWert(value: any): number {
    switch (value) {
      case 'Kategorien':
        return 0;
        break;
      case 'Wochentag':
        return 1;
        break;
    }
    return -1;
  }


  getStringByWochentagWert(value: string): number {
    switch (value) {
      case 'Sonntag':
        return 0;
        break;
      case 'Montag':
        return 1;
        break;
      case 'Dienstag':
        return 2;
        break;
      case 'Mitwoch':
        return 3;
        break;
      case 'Donnerstag':
        return 4;
        break;
      case 'Freitag':
        return 5;
        break;
      case 'Samstag':
        return 6;
        break;
    }

    return -1;
  }

  getStringByWertWert(value: any): number {
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

  getStringByXAchsenWert(value: any): XAchsenSkalierungsOptionen {
    switch(value) {
      case 0:
        return XAchsenSkalierungsOptionen.alleTageImMonat;
        break;
      case 1:
        return XAchsenSkalierungsOptionen.alleMonateImJahr;
        break;
    }
    return XAchsenSkalierungsOptionen.alleTageImMonat;
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
    this.createMode = true;
    this.isCreateLayoutDiologVisible.set(true);
  }

  getViewModel(eintrag: IAuswertungsLayout): ListElementViewModel {
    return {
      data: {
        id: eintrag.id,
        title: eintrag.data.titel,
        menuItems: [
          {
            label: 'bearbeiten',
            onClick: this.onEditClicked,
            isEditButton: true
          },
          {
            label: 'löschen',
            onClick: this.onDeleteClicked
          }
        ]
      },
      settings: {
        isDarker: eintrag.id < 0,
        doMenuExist: eintrag.id > 0
      }
    }
  }

  onListElemEditClicked(eintrag: ListElementViewModel) {
    console.log(this.viewModel.elemente);
    console.log(eintrag)
    this.createMode = false;
    this.selectedLayout = this.viewModel.elemente.find(layout => layout.id === eintrag.data.id);

    this.selectedElementToEdit = this.getLayoutViewModel(this.selectedLayout!);

    this.isCreateLayoutDiologVisible.set(true);
  }

  getLayoutViewModel(eintrag: IAuswertungsLayout): CreateAuswertungsLayoutDialogViewModel {
    console.log(eintrag)
    const diagramme: DiagramDetailsViewModel[] = []

    eintrag.data.diagramme.forEach(diagram => {
      const diagramDetailsViewModel: DiagramDetailsViewModel = {
        id: -1,
        filter: {
          filter: diagram.filter[0].filter,
          value: diagram.filter[0].value
        },
        wert: diagram.valueOption,
        xAchse: this.getStringByXAchsenWert(diagram.xAchsenSkalierung),
        title: diagram.title,
        color: diagram.barColor
      }

      diagramme.push(diagramDetailsViewModel)
    })


    return {
      title: eintrag.data.titel,
      diagramme: diagramme
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
    this.isCreateLayoutDiologVisible.set(false);
  }

  onEditClicked = (eintrag: ListElementData) => {
    /*
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
    this.dialogService.showEditDialog(editDialogViewModel);*/
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
