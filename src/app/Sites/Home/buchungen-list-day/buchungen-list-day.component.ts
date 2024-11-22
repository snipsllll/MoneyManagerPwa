import {Component, computed, Input} from '@angular/core';
import {Day} from "../../../Models/Interfaces";
import {UT} from "../../../Models/Classes/UT";
import {DataService} from "../../../Services/DataService/data.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {TagesAnzeigeOptions} from "../../../Models/Enums";

@Component({
  selector: 'app-buchungen-list-day',
  templateUrl: './buchungen-list-day.component.html',
  styleUrl: './buchungen-list-day.component.css'
})
export class BuchungenListDayComponent {
  @Input() day!: Day;

  ausgabenForDay = computed(() => {
    this.dataService.updated();
    const day = this.dataProvider.getDayByeDate(this.day.date);
    let ausgaben = 0;
    day?.buchungen?.forEach(buchung => {
      ausgaben += buchung.data.betrag!;
    })
    return ausgaben;
  })

  ut: UT = new UT();

  constructor(public dataProvider: DataProviderService, private dataService: DataService) {
  }

  getTagesAnzeigeText() {
    switch (this.dataProvider.getSettings().tagesAnzeigeOption) {
      case TagesAnzeigeOptions.Tagesausgaben:
        return `-${this.ut.toFixedDown(this.ausgabenForDay(), 2)}€`
        break;
      case TagesAnzeigeOptions.RestbetragVonSollBudget:
          return `${this.ut.toFixedDown(this.dataProvider.getAvailableMoneyForDayFromSoll(this.day.date), 2)}€`
          break;
      case TagesAnzeigeOptions.RestbetragVonIstBetrag:
          return `${this.ut.toFixedDown(this.dataProvider.getAvailableMoneyForDay(this.day.date), 2)}€`;
          break;
      default:
          return undefined;
          break;
    }
  }

  protected readonly TagesAnzeigeOptions = TagesAnzeigeOptions;
}
