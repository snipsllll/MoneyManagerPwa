import {Component, computed, Input, OnInit} from '@angular/core';
import {Day} from "../../../Models/Interfaces";
import {UT} from "../../../Models/Classes/UT";
import {DataService} from "../../../Services/DataService/data.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {TagesAnzeigeOptions} from "../../../Models/Enums";
import {IBuchung} from "../../../Models/NewInterfaces";

@Component({
  selector: 'app-buchungen-list-day',
  templateUrl: './buchungen-list-day.component.html',
  styleUrl: './buchungen-list-day.component.css'
})
export class BuchungenListDayComponent implements OnInit{
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

  alleDayBuchungen: IBuchung[] = []

  ut: UT = new UT();

  constructor(public dataProvider: DataProviderService, private dataService: DataService) {
  }

  ngOnInit() {
    //TODO bei leerer this.day.buchungen verschwindet this.day.geplanteAusgabenBuchungen
    this.alleDayBuchungen = (this.day.buchungen ?? []).concat(this.day.geplanteAusgabenBuchungen ?? []);
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
      case TagesAnzeigeOptions.RestMonat:
        return 'not implemented yet' //`${this.ut.toFixedDown(this.dataProvider.getAvailableMoney(this.day.date).availableForMonth, 2)}€`
        break;
      default:
          return undefined;
          break;
    }
  }

  getTagesAnzeigeBudget(): number {
    switch (this.dataProvider.getSettings().tagesAnzeigeOption) {
      case TagesAnzeigeOptions.Tagesausgaben:
        return this.ut.toFixedDown(this.ausgabenForDay(), 2)!
        break;
      case TagesAnzeigeOptions.RestbetragVonSollBudget:
        return this.ut.toFixedDown(this.dataProvider.getAvailableMoneyForDayFromSoll(this.day.date), 2)!
        break;
      case TagesAnzeigeOptions.RestbetragVonIstBetrag:
        return this.ut.toFixedDown(this.dataProvider.getAvailableMoneyForDay(this.day.date), 2)!
        break;
      case TagesAnzeigeOptions.RestMonat:
        return this.ut.toFixedDown(this.dataProvider.getAvailableMoney(this.day.date).availableForMonth, 2)!
        break;
    }
    return 0;
  }

  protected readonly TagesAnzeigeOptions = TagesAnzeigeOptions;
}
