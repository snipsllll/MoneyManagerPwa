import {Component, computed, OnInit} from '@angular/core';
import {Day, Month} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";

@Component({
  selector: 'app-buchungen-list',
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent  implements OnInit{
  date = new Date();
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
}
