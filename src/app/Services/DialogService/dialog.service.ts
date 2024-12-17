import {Injectable} from '@angular/core';
import {ConfirmDialogViewModel} from "../../Models/ViewModels/ConfirmDialogViewModel";
import {EditDialogViewModel} from "../../Models/ViewModels/EditDialogViewModel";
import {CreateDialogViewModel} from "../../Models/ViewModels/CreateDialogViewModel";
import {MonatFixkostenDialogViewModel} from "../../Models/ViewModels/MonatFixkostenDialogViewModel";
import {BuchungsKategorienDialogViewModel} from "../../Models/ViewModels/BuchungsKategorienDialogViewModel";
import {DataProviderService} from "../DataProviderService/data-provider.service";
import {DataChangeService} from "../DataChangeService/data-change.service";
import {AuswertungenDialogViewModel, IAuswertungsLayout} from "../../Models/Auswertungen-Interfaces";
import {DataService} from "../DataService/data.service";
import {NotificationPopupViewModel} from "../../Models/ViewModels/NotificationPopupViewModel";

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

  isNotificationPopupVisible = false;
  notificationPopupViewModel?: NotificationPopupViewModel;

  constructor(private dataService: DataService, private dataChangeService: DataChangeService, private dataProvider: DataProviderService) {
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
        this.dataService.triggerUpdated();
      }
    }
  }

  showAuswertungenDialog() {
    this.isAuswertungenDialogVisible = true;
    this.auswertungenDialogViewModel = {
      elemente: this.dataProvider.getAuswertungsLayouts(),
      onAbortClicked: () => {
        this.isAuswertungenDialogVisible = false;
      },
      onSaveClicked: (elemente: IAuswertungsLayout[]) => {
        this.isAuswertungenDialogVisible = false;
        this.dataChangeService.editAuswertungsLayouts(elemente);
      }
    }
  }

  showNotificationPopup(notificationPopupViewModel: NotificationPopupViewModel) {
    this.isNotificationPopupVisible = true;
    this.notificationPopupViewModel = notificationPopupViewModel;
  }
}

