import {Component, computed, OnInit, signal} from '@angular/core';
import {Day, Month} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";

@Component({
  selector: 'app-buchungen-list',
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent  implements OnInit{
  date = new Date();
  isGeplantVisible = signal<boolean>(false);
  days = computed(() => {
    const months: Month[] = this.dataService.userData.months();
    const days: Day[] = []
    months.forEach(month => {
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          if(day.buchungen!.length > 0){
            days.push(day);
          }
        })
      })
    });
    return this.orderByDateDesc(days);
  })

  constructor(private dataService: DataService){

  }

  ngOnInit() {

  }

  orderByDateDesc(array: Day[]) {
    const rArray: Day[] = [];
    array.forEach(day => {
      day.buchungen?.sort((a, b) => b.date.getTime() - a.date.getTime())
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
    return this.days().filter(day => day.date.getDate() > new Date().getDate() || day.date.getMonth() > new Date().getMonth() || day.date.getFullYear() > new Date().getFullYear());
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
