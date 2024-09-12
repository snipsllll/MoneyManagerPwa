import {Component, computed, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {MenuItem} from "../../Models/Interfaces";

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})

export class ListElementComponent implements OnInit{

  @Input() viewModel!: ListElementViewModel;
  @Output() onElementClicked = new EventEmitter();
  isMenuVisible = signal<boolean>(false);

  constructor(private dialogService: DialogService) {
  }

  ngOnInit() {
    console.log(123)
    console.log(this.viewModel)
  }

  onMenuClicked() {
    this.isMenuVisible.set(!this.isMenuVisible());
  }

  onMenuEintragClicked(menuItem: MenuItem) {
    this.isMenuVisible.set(false);
    menuItem.onClick(this.viewModel.data);
  }

  onEintragClicked() {
    if(this.viewModel.settings.doDetailsExist) {
      this.onElementClicked.emit();
    }
  }
}
