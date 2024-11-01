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
    menuItem.onClick(this.viewModel.data);
  }

  onEintragClicked() {
    if(this.viewModel.settings.doDetailsExist) {
      this.onElementClicked.emit();
    }
  }

  toFixedDown(number: number, decimals: number): number {
    const numberString = number.toString();
    const [numberVorKomma, numberNachKomma = ""] = numberString.split(".");

    // Verkürze numberNachKomma auf die gewünschte Anzahl von Dezimalstellen
    const gekuerztesNachKomma = numberNachKomma.substring(0, decimals).padEnd(decimals, '0');

    // Kombiniere den Vor- und Nachkomma-Teil wieder als Zahl
    return parseFloat(`${numberVorKomma}.${gekuerztesNachKomma}`);
  }

  protected readonly Color = Color;
}
