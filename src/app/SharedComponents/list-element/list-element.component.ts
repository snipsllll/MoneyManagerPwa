import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {MenuItem} from "../../Models/Interfaces";
import {Color} from "../../Models/Enums";
import {UT} from "../../Models/Classes/UT";
import {BehaviorSubject} from "rxjs";

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})

export class ListElementComponent implements OnInit{

  @Input() viewModel!: ListElementViewModel;
  isExpanded: boolean = false;
  @Output() onElementClicked = new EventEmitter();
  @Output() onEditClicked = new EventEmitter();
  isMenuVisible = signal<boolean>(false);
  menuItems?: MenuItem[];
  ut: UT = new UT();

  showBoxMenu = new BehaviorSubject<boolean>(false);
  boxMenuElemente: string[] = ['e1', 'e2', 'e3'];

  constructor() {

  }

  ngOnInit() {
    this.menuItems = this.viewModel.data.menuItems;
  }

  onMenuClicked() {
    this.isMenuVisible.set(!this.isMenuVisible());
  }

  onMenuEintragClicked(menuItem: MenuItem) {
    if(!menuItem.disabled){
      this.isMenuVisible.set(false);
      if(menuItem.isEditButton) {
        this.onEditClicked.emit(this.viewModel);
      }
      menuItem.onClick(this.viewModel.data);
    }
  }

  onEintragClicked() {
    if(this.viewModel.settings.doDetailsExist) {
      this.isExpanded = !this.isExpanded;
    }
  }

  onBoxClicked() {
    this.showBoxMenu.next(true);
  }

  protected readonly Color = Color;
}
