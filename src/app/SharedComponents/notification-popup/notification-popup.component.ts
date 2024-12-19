import {Component, Input} from '@angular/core';
import {NotificationPopupViewModel} from "../../Models/ViewModels/NotificationPopupViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.css'
})
export class NotificationPopupComponent {
  @Input() viewModel!: NotificationPopupViewModel;
  isPopupHidden = true;

  constructor(private dialogService: DialogService) {
    setTimeout(() => {
      this.showPopup();
    }, 100);
  }

  showPopup() {
    this.isPopupHidden = false;
    setTimeout(() => {
      this.isPopupHidden = true;
      setTimeout(() => {
        this.dialogService.isNotificationPopupVisible = false;
      }, 500)
    }, this.viewModel.duration ?? 4000);
  }
}
