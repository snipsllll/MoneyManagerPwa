import {Component, Input, signal} from '@angular/core';
import {ListElementData, ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {MenuItem} from "../../Models/Interfaces";
import {DataService} from "../../Services/DataService/data.service";

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})
export class ListElementComponent {

  @Input() viewModel!: ListElementViewModel;
  isMenuVisible = signal<boolean>(false);

  constructor(private dialogService: DialogService) {
  }

  onMenuClicked() {
    this.isMenuVisible.set(!this.isMenuVisible());
  }

  onMenuEintragClicked(menuItem: MenuItem) {
    this.isMenuVisible.set(false);
    menuItem.onClick(this.viewModel.data);
  }
}
