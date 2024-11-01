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
    const [numberVorKomma, numberNachKomma = ""] = numberString.split(".");

    // Verkürze numberNachKomma auf die gewünschte Anzahl von Dezimalstellen
    const gekuerztesNachKomma = numberNachKomma.substring(0, decimals).padEnd(decimals, '0');

    // Kombiniere den Vor- und Nachkomma-Teil wieder als Zahl
    return parseFloat(`${numberVorKomma}.${gekuerztesNachKomma}`);
  }
}
