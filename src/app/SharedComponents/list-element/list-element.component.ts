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
  @Output() onElementClicked = new EventEmitter();
  isMenuVisible = signal<boolean>(false);
  ut: UT = new UT();

  constructor() {
  }

  ngOnInit() {

  }

  onMenuClicked() {
    this.isMenuVisible.set(!this.isMenuVisible());
  }

  onMenuEintragClicked(menuItem: MenuItem) {
    if(!menuItem.grayedOut){
      this.isMenuVisible.set(false);
    }
    console.log(this.viewModel.data)
    menuItem.onClick(this.viewModel.data);
  }

  onEintragClicked() {
    if(this.viewModel.settings.doDetailsExist) {
      this.onElementClicked.emit();
    }
  }

  protected readonly Color = Color;
}
