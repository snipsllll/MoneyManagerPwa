import {Component, computed, signal} from '@angular/core';
import {Day} from "../../../Models/Interfaces";
import {DataService} from "../../../Services/DataService/data.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {IBuchungenlistMonth} from "../../../Models/NewInterfaces";

@Component({
  selector: 'app-buchungen-list',
  templateUrl: './buchungen-list.component.html',
  styleUrl: './buchungen-list.component.css'
})
export class BuchungenListComponent {
  date = new Date();
  days = computed(() => {
    this.dataService.updated();
    return this.orderByDateDesc(this.dataProvider.getAllDaysWithBuchungen());
  })

  months = computed((): IBuchungenlistMonth[] => {
    this.dataService.updated();
    return this.orderByMonthDesc(this.dataProvider.getAllDaysWithBuchungen());
  })

  constructor(private dataProvider: DataProviderService, private dataService: DataService){

  }

  orderByDateDesc(array: Day[]) {
    const rArray: Day[] = [];
    array.forEach(day => {
      day.buchungen?.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
      rArray.push(day);
    })
    return rArray.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  }

  orderByMonthDesc(array: Day[]): IBuchungenlistMonth[] {
    return array
      .map(day => {
        day.buchungen?.sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime());
        return day;
      })
      .filter(day => new Date(day.date).getTime() <= Date.now()) // Filtere Tage in der Zukunft
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .reduce((acc: IBuchungenlistMonth[], day) => {
        const monthName = new Date(day.date).toLocaleString('default', { month: 'long', year: 'numeric' }); // Get readable month name
        const monthIndex = acc.findIndex(group => group.monthName === monthName);
        if (monthIndex > -1) {
          acc[monthIndex].days.push(day);
        } else {
          acc.push({ monthName, days: [day], isVisible: true, isGeplantMonth: false });
        }
        return acc;
      }, []);
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

  getMonthForGeplant() {
    const geplantMonth: IBuchungenlistMonth = {
      monthName: 'Geplant',
      days: this.getFutureDays(),
      isVisible: false,
      isGeplantMonth: true
    }

    return geplantMonth
  }
}
