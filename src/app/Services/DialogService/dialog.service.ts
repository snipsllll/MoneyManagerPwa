import { Injectable } from '@angular/core';
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";

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

  constructor() {
  }

  showConfirmDialog(confirmDialogViewModel: ConfirmDialogViewModel) {
    this.isConfirmDialogVisible = true;
    this.confirmDialogViewModel = confirmDialogViewModel;
  }

  showEditDialog(editDialogViewModel: EditDialogViewModel) {
    console.log(78239869326724398274982)
    this.isEditDialogVisible = true;
    this.editDialogViewModel = editDialogViewModel;
  }

  showCreateDialog(createDialogViewModel: CreateDialogViewModel) {
    this.isCreateDialogVisible = true;
    this.createDialogViewModel = createDialogViewModel;
  }
}

