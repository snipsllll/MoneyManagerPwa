import {Component, Input} from '@angular/core';
import {NotificationPopupViewModel} from "../../Models/ViewModels/NotificationPopupViewModel";

@Component({
  selector: 'app-notification-popup',
  templateUrl: './notification-popup.component.html',
  styleUrl: './notification-popup.component.css'
})
export class NotificationPopupComponent {
  @Input() viewModel!: NotificationPopupViewModel;
  isPopupHidden = true;

  constructor() {
    setTimeout(() => {
      this.showPopup();
    }, 100);
  }

  showPopup() {
    this.isPopupHidden = false;
    setTimeout(() => {
      this.isPopupHidden = true;
    }, 4000);
  }
}
