import {Component, Input} from '@angular/core';
import {Day} from "../../../Models/Interfaces";

@Component({
  selector: 'app-buchungen-list-day',
  templateUrl: './buchungen-list-day.component.html',
  styleUrl: './buchungen-list-day.component.css'
})
export class BuchungenListDayComponent {
  @Input() day!: Day;

  toFixedDown(number: number, decimals: number): number {
    const numberString = number.toString();
    const numberVorKomma = numberString.substring(0, numberString.indexOf("."));
    let numberNachKomma = numberString.substring(numberString.indexOf(".") + 1, numberString.length);
    numberNachKomma = numberNachKomma.substring(0, decimals);
    let x = +numberVorKomma > 0 ? (+numberVorKomma) + (+numberNachKomma / 100) : (+numberVorKomma) - (+numberNachKomma / 100);
    return +x.toFixed(2);
  }
}
