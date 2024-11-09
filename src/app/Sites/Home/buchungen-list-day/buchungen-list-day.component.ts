import {Component, computed, Input} from '@angular/core';
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

  availableMoneyForDay = computed(() => {
    this.dataService.updated();
    return this.dataService.getAvailableMoneyForDay(this.day.date)
  })

  ut: UT = new UT();

  constructor(private dataService: DataService, public settingsService: SettingsService) {
  }
}
