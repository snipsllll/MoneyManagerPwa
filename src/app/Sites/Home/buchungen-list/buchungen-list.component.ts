import {Component, computed, OnInit, signal} from '@angular/core';
import {Day} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";

@Component({
  selector: 'app-buchungen-list',
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent  implements OnInit{
  date = new Date();
  isGeplantVisible = signal<boolean>(false);
  days = computed(() => {
    this.dataService.updated();
    return this.orderByDateDesc(this.dataProvider.getAllDays());
  })

  constructor(private dataProvider: DataProviderService, private dataService: DataService){

  }

  ngOnInit() {
    console.log(this.days())
  }

  orderByDateDesc(array: Day[]) {
    //TODO
    const rArray: Day[] = [];
    array.forEach(day => {
      day.buchungen?.sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
      rArray.push(day);
    })
    return rArray.sort((a, b) => b.date.getTime() - a.date.getTime())
  }

  getPresentAndPastDays() {
    const today = new Date();  // Hol das heutige Datum

    return this.days().filter(day => {
      const dayDate = day.date;
      return dayDate <= today;  // Vergleiche direkt das Datum
    });
  }

  getFutureDays() {
    const today = new Date();  // Hol das heutige Datum

    return this.days().filter(day => {
      const dayDate = day.date;
      return dayDate > today;  // Vergleiche direkt das Datum
    });
  }

  setIsGeplantVisibleTrue() {
    this.isGeplantVisible.set(true);
  }

  setIsGeplantVisibleFalse() {
    this.isGeplantVisible.set(false);
  }

  toggleIsGeplantVisible() {
    this.isGeplantVisible.set(!this.isGeplantVisible());
  }
}
