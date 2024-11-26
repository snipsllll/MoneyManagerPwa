import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {MenuItem} from "../../Models/Interfaces";
import {Color} from "../../Models/Enums";
import {UT} from "../../Models/Classes/UT";

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})

export class ListElementComponent implements OnInit{

  @Input() viewModel!: ListElementViewModel;
  isExpanded: boolean = false;
  @Output() onElementClicked = new EventEmitter();
  isMenuVisible = signal<boolean>(false);
  ut: UT = new UT();

  constructor() {
  }

  ngOnInit() {

  }

  onMenuClicked() {
    console.log(1)
    this.isMenuVisible.set(!this.isMenuVisible());
  }

  onMenuEintragClicked(menuItem: MenuItem) {
    if(!menuItem.grayedOut){
      this.isMenuVisible.set(false);
      menuItem.onClick(this.viewModel.data);
    }
  }

  onEintragClicked() {
    if(this.viewModel.settings.doDetailsExist) {
      this.isExpanded = !this.isExpanded;
    }
  }

  protected readonly Color = Color;
}
