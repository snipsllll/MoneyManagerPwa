import {Component, computed, Input, signal} from '@angular/core';
import {Day} from "../../../Models/Interfaces";
import {UT} from "../../../Models/Classes/UT";
import {DataService} from "../../../Services/DataService/data.service";
import {SettingsService} from "../../../Services/SettingsService/settings.service";

@Component({
  selector: 'app-buchungen-list-day',
  templateUrl: './buchungen-list-day.component.html',
  styleUrl: './buchungen-list-day.component.css'
})
export class BuchungenListDayComponent {
  @Input() day!: Day;

  ausgabenForDay = computed(() => {
    this.dataService.updated();
    const day = this.dataService.getDayByeDate(this.day.date);
    let ausgaben = 0;
    day?.buchungen?.forEach(buchung => {
      ausgaben += buchung.betrag!;
    })
    return ausgaben;
  })

  ut: UT = new UT();

  constructor(private dataService: DataService, public settingsService: SettingsService) {
  }
}
