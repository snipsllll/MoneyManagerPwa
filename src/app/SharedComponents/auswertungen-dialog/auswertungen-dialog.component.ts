import {Component, Input, signal} from '@angular/core';
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {EditDialogData} from "../../Models/ViewModels/EditDialogViewModel";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {NewAuswertungenDialogViewModel, NewIAuswertungsLayout} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-auswertungen-dialog',
  templateUrl: './auswertungen-dialog.component.html',
  styleUrl: './auswertungen-dialog.component.css'
})
export class AuswertungenDialogComponent {
  @Input() viewModel!: NewAuswertungenDialogViewModel;
  isCreateLayoutDiologVisible = signal<boolean>(false);
  emptyCreateLayoutDialogViewModel: NewIAuswertungsLayout = {
    id: this.getNextFreeAuswertungsLayoutId(),
    data: {
      layoutTitle: '',
      diagramme: []
    }
  }

  selectedLayout?: NewIAuswertungsLayout;
  createMode: boolean = false;

  constructor(private dataProvider: DataProviderService, private dataChangeService: DataChangeService, private dialogService: DialogService, public dataService: DataService) {
  }

  onCreateDialogSaveClicked(layout: NewIAuswertungsLayout) {
    if (this.createMode) {
      this.viewModel.elemente.push(layout);
    } else {
      this.viewModel.elemente[this.viewModel.elemente.findIndex(element => element.id === layout.id!)] = layout;
    }

    this.isCreateLayoutDiologVisible.set(false);
  }

  onCancelClicked() {
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
  }

  onSaveClicked() {
    this.dialogService.isCreateDialogVisible = false;
    this.viewModel.onSaveClicked(this.viewModel.elemente);
  }

  onPlusClicked() {
    this.createMode = true;
    this.isCreateLayoutDiologVisible.set(true);
  }

  getListElementViewModel(eintrag: NewIAuswertungsLayout): ListElementViewModel {
    return {
      data: {
        id: eintrag.id,
        title: eintrag.data.layoutTitle,
        menuItems: [
          {
            label: 'bearbeiten',
            onClick: this.nothing,
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

  nothing() {
  }

  onListElemEditClicked(eintrag: ListElementViewModel) {
    this.createMode = false;
    this.selectedLayout = this.viewModel.elemente.find(layout => layout.id === eintrag.data.id);

    this.isCreateLayoutDiologVisible.set(true);
  }

  onCreateCancelClicked = () => {
    this.isCreateLayoutDiologVisible.set(false);
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



  getKategorieWertByString(value: any) {
    const kategorien = this.dataProvider.getBuchungsKategorien();
    const foundItem = kategorien.find(item => item.name === value);
    return foundItem ? foundItem.id : -1;
  }

  getStringByKategorieWert(value: number) {
    const kategorien = this.dataProvider.getBuchungsKategorien();
    const foundItem = kategorien.find(item => item.id === value);
    return foundItem ? foundItem.name : '';
  }

  getHorizontaleLinieWertByString(value: any): number {
    switch (value) {
      case 'daySollBudget':
        return 0;
        break;
      case 'zahl':
        return 1;
        break;
    }

    return -1;
  }

  getStringByHorizontaleLinieWert(value: any): string {
    switch (value) {
      case 0:
        return 'daySollBudget';
        break;
      case 1:
        return 'zahl';
        break;
    }

    return '';
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
    switch (value) {
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
    switch (value) {
      case  'alleMonateImJahr':
        return 0
        break;
      case  'alleTageImMonat':
        return 1
        break;
    }
    return -1
  }

  getStringByFilterWert(value: any) {
    switch (value) {
      case 0:
        return 'Kategorien';
        break;
      case 1:
        return 'Wochentag';
        break;
    }
    return undefined;
  }


  getStringByWochentagWert(value: any): string {
    switch (value) {
      case 0:
        return 'Sonntag';
        break;
      case 1:
        return 'Montag';
        break;
      case 2:
        return 'Dienstag';
        break;
      case 3:
        return 'Mitwoch';
        break;
      case 4:
        return 'Donnerstag';
        break;
      case 5:
        return 'Freitag';
        break;
      case 6:
        return 'Samstag';
        break;
    }

    return '';
  }

  getStringByWertWert(value: any): string {
    switch (value) {
      case 0:
        return 'Restgeld';
        break;
      case 1:
        return 'Ausgaben';
        break;
      case 2:
        return 'Sparen';
        break;
      case 3:
        return 'TotalBudget';
        break;
      case 4:
        return 'DifferenzZuDaySollBudget';
        break;
    }
    return '';
  }

  getStringByXAchsenWert(value: any): string {
    switch (value) {
      case 0:
        return 'alleMonateImJahr';
        break;
      case 1:
        return 'alleTageImMonat';
        break;
    }
    return '';
  }
}
