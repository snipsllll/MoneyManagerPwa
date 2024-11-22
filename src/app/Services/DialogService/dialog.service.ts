import { Injectable } from '@angular/core';
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {
  MonatFixkostenDialogComponent
} from "../../SharedComponents/monat-fixkosten-dialog/monat-fixkosten-dialog/monat-fixkosten-dialog.component";
import {MonatFixkostenDialogViewModel} from "../../Models/ViewModels/MonatFixkostenDialogViewModel";

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

  constructor() {
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
}

