import {Component, EventEmitter, Input, OnInit, Output, signal} from '@angular/core';
import {ListElementViewModel} from "../../Models/ViewModels/ListElementViewModel";
import {MenuItem} from "../../Models/Interfaces";
import {Color} from "../../Models/Enums";

@Component({
  selector: 'app-list-element',
  templateUrl: './list-element.component.html',
  styleUrl: './list-element.component.css'
})

export class ListElementComponent implements OnInit{

  @Input() viewModel!: ListElementViewModel;
  @Output() onElementClicked = new EventEmitter();
  isMenuVisible = signal<boolean>(false);

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

  toFixedDown(number: number, decimals: number): number {
    const numberString = number.toString();
    if(numberString.indexOf(".") === -1) {
      return number;
    } else if(numberString.indexOf(".") === numberString.length - 2) {
      const numberVorKomma = numberString.substring(0, numberString.indexOf("."));
      let numberNachKomma = numberString.substring(numberString.indexOf(".") + 1, numberString.length);
      numberNachKomma = numberNachKomma.substring(0, decimals);
      return +numberVorKomma > 0 ? (+numberVorKomma) + (+numberNachKomma / 10) : (+numberVorKomma) - (+numberNachKomma / 10);
    }
    const numberVorKomma = numberString.substring(0, numberString.indexOf("."));
    let numberNachKomma = numberString.substring(numberString.indexOf(".") + 1, numberString.length);
    numberNachKomma = numberNachKomma.substring(0, decimals);
    return +numberVorKomma > 0 ? (+numberVorKomma) + (+numberNachKomma / 100) : (+numberVorKomma) - (+numberNachKomma / 100);
  }

  protected readonly Color = Color;
}
