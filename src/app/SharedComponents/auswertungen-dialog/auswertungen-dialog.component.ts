import {Component, Input, signal} from '@angular/core';
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {EditDialogData} from "../../Models/ViewModels/EditDialogViewModel";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {AuswertungenDialogViewModel, IAuswertungsLayout} from "../../Models/Auswertungen-Interfaces";

@Component({
  selector: 'app-auswertungen-dialog',
  templateUrl: './auswertungen-dialog.component.html',
  styleUrl: './auswertungen-dialog.component.css'
})
export class AuswertungenDialogComponent {
  @Input() viewModel!: AuswertungenDialogViewModel;
  isCreateLayoutDiologVisible = signal<boolean>(false);
  emptyCreateLayoutDialogViewModel: IAuswertungsLayout = {
    id: this.getNextFreeAuswertungsLayoutId(),
    data: {
      layoutTitle: '',
      diagramme: []
    }
  }

  selectedLayout?: IAuswertungsLayout;
  createMode: boolean = false;

  constructor(private dataProvider: DataProviderService,private dialogService: DialogService, public dataService: DataService) {
    console.log(this.viewModel)
  }

  onCreateDialogSaveClicked(layout: IAuswertungsLayout) {
    if (this.createMode) {
      console.log(layout)
      this.viewModel.elemente.push(layout);
    } else {
      this.viewModel.elemente[this.viewModel.elemente.findIndex(element => element.id === layout.id!)] = layout;
    }

    this.isCreateLayoutDiologVisible.set(false);
    this.emptyCreateLayoutDialogViewModel = {
      id: this.getNextFreeAuswertungsLayoutId(),
      data: {
        layoutTitle: '',
        diagramme: []
      }
    }
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
    this.selectedLayout = undefined;
    this.isCreateLayoutDiologVisible.set(true);
    console.log(this.emptyCreateLayoutDialogViewModel)
  }

  getListElementViewModel(eintrag: IAuswertungsLayout): ListElementViewModel {
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
    if(this.viewModel) {
      for (let i = 0; i < this.viewModel.elemente?.length; i++) {
        if (this.viewModel.elemente!.find(x => x.id === freeId) === undefined) {
          return freeId;
        } else {
          freeId++;
        }
      }
    }

    return freeId;
  }
}
