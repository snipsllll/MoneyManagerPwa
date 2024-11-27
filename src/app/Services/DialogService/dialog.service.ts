import { Injectable } from '@angular/core';
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {
  MonatFixkostenDialogComponent
} from "../../SharedComponents/monat-fixkosten-dialog/monat-fixkosten-dialog/monat-fixkosten-dialog.component";
import {MonatFixkostenDialogViewModel} from "../../Models/ViewModels/MonatFixkostenDialogViewModel";
import {BuchungsKategorienDialogViewModel} from "../../Models/ViewModels/BuchungsKategorienDialogViewModel";
import {DataProviderService} from "../DataProviderService/data-provider.service";
import {DataChangeService} from "../DataChangeService/data-change.service";
import {AuswertungenDialogViewModel} from "../../Models/ViewModels/AuswertungenDialogViewModel";
import {IAuswertungsLayout} from "../../Models/NewInterfaces";
import {CreateAuswertungsLayoutDialogViewModel} from "../../Models/ViewModels/CreateAuswertungsLayoutDialogViewModel";

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  isConfirmDialogVisible = false;
  confirmDialogViewModel?: ConfirmDialogViewModel;

  isEditDialogVisible = false;
  editDialogViewModel?: EditDialogViewModel;

  isCreateDialogVisible = false;
  createDialogViewModel?: CreateDialogViewModel;

  isMonatFixkostenDialogVisible = false;
  monatFixkostenDialogViewModel?: MonatFixkostenDialogViewModel;

  isBuchungsKategorienDialogVisible = false;
  buchungsKategorienDialogViewModel?: BuchungsKategorienDialogViewModel;

  isAuswertungenDialogVisible = false;
  auswertungenDialogViewModel?: AuswertungenDialogViewModel;

  isCreateAuswertungsLayoutDialogVisible = false;
  createAuswertungsLayoutDialogViewModel?: CreateAuswertungsLayoutDialogViewModel;

  constructor(private dataChangeService: DataChangeService, private dataProvider: DataProviderService) {
  }

  showConfirmDialog(confirmDialogViewModel: ConfirmDialogViewModel) {
    this.isConfirmDialogVisible = true;
    this.confirmDialogViewModel = confirmDialogViewModel;
  }

  showEditDialog(editDialogViewModel: EditDialogViewModel) {
    this.isEditDialogVisible = true;
    this.editDialogViewModel = editDialogViewModel;
  }

  showCreateDialog(createDialogViewModel: CreateDialogViewModel) {
    this.isCreateDialogVisible = true;
    this.createDialogViewModel = createDialogViewModel;
  }

  showMonatFixkostenDialog(monatFixkostenDialogViewModel: MonatFixkostenDialogViewModel) {
    this.isMonatFixkostenDialogVisible = true;
    this.monatFixkostenDialogViewModel = monatFixkostenDialogViewModel;
  }

  showCreateAuswertungsLayoutDialog(viewModel: CreateAuswertungsLayoutDialogViewModel) {
    this.isCreateAuswertungsLayoutDialogVisible = true;
    this.createAuswertungsLayoutDialogViewModel = viewModel;
  }

  showBuchungsKategorienDialog() {
    this.isBuchungsKategorienDialogVisible = true;
    this.buchungsKategorienDialogViewModel = {
      elemente: this.dataProvider.getBuchungsKategorien(),
      onAbortClicked: () => {
        this.isBuchungsKategorienDialogVisible = false;
      },
      onSaveClicked: (elemente: {id: number, name: string}[]) => {
        this.dataChangeService.deleteAllBuchungsKategorien();
        elemente.forEach(element => {
          this.dataChangeService.addBuchungsKategorie(element.name);
        });
        this.isBuchungsKategorienDialogVisible = false;
      }
    }
  }

  showAuswertungenDialog() {
    this.isAuswertungenDialogVisible = true;
    this.auswertungenDialogViewModel = {
      elemente: this.dataProvider.getAuswertungsLayouts(),
      onAbortClicked: () => {
        console.log('abort clicked')
        this.isAuswertungenDialogVisible = false;
      },
      onSaveClicked: (elemente: IAuswertungsLayout[]) => {
        console.log('save clicked')
        this.isAuswertungenDialogVisible = false;
        this.dataChangeService.editAuswertungsLayouts(elemente);
      }
    }
  }
}

