import {Injectable, signal} from '@angular/core';
import {UserData} from "../../Models/Classes/UserData";
import {Day, Month, SavedData, Week} from "../../Models/Interfaces";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData = new UserData();
  updated = signal<number>(0);

  constructor() {
    this.update(false);
  }

  update(safeAfterUpdate?: boolean) {
    //Wenn für den 'heutigen Tag (new Date())' noch kein Monat vorhanden ist, dann erstelle einen neuenn monat für den 'heutigen Tag'
    if (!this.checkIfMonthExistsForDay(new Date())) {
      this.createNewMonth(new Date());
    }

    /*Weird and crazy stuff beginns here*/
    this.userData.months.forEach(month => {
      this.updateBuchungenForMonth(month.startDate);

      this.updateFixkostenForMonth(month.startDate);

      this.calcDailyBudgetForMonth(month.startDate);

      this.calcBudgetForMonth(month.startDate);

      this.calcBudgetsForAllDaysInMonth(month.startDate);

      this.calcBudgetsForAllWeeksInMonth(month.startDate);

      this.calcIstBudgetsForAllDaysInMonth(month.startDate);

      this.calcIstBudgetsForAllWeeksInMonth(month.startDate);

      this.calcIstBudgetForMonth(month.startDate);
    });

    if (safeAfterUpdate === undefined || safeAfterUpdate)
      this.save();

    this.sendUpdateToComponents();
  }

  createNewMonthIfNecessary(date: Date) {
    if (!this.checkIfMonthExistsForDay(date)) {
      this.createNewMonth(date);
    }
  }


  private checkIfMonthExistsForDay(date: Date): boolean {
    return this.userData.months.findIndex(month => month.startDate.getMonth() === date.getMonth() && month.startDate.getFullYear() === date.getFullYear()) !== -1;
  }

  private createNewMonth(date: Date) {
    const startDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0); // Last day of the month
    const daysInMonth: number = endDate.getDate() - startDate.getDate() + 1;

    const weeks: Week[] = [];

    let weekStartDate = startDate;

    while (weekStartDate <= endDate) {
      // Calculate the end of the week, or the end of the month if it falls within this week
      let weekEndDate: Date = this.getSunday(weekStartDate);
      if (weekEndDate > endDate) {
        weekEndDate = endDate; // Adjust to end of the month if the week goes past it
      }

      const daysInWeek = weekEndDate.getDate() - weekStartDate.getDate() + 1;
      const days: Day[] = [];

      // Populate days in the week
      for (let d = weekStartDate.getDate(); d <= weekEndDate.getDate(); d++) {
        const dateForDay = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), d);
        days.push({date: dateForDay});
      }

      // Push the week to weeks array
      weeks.push({
        startDate: new Date(weekStartDate),
        endDate: new Date(weekEndDate),
        daysInWeek: daysInWeek,
        days: days
      });

      // Move to the next Monday
      weekStartDate = this.getNextMonday(weekStartDate);
    }

    const month: Month = {
      startDate: startDate,
      endDate: endDate,
      daysInMonth: daysInMonth,
      weeks: weeks
    };

    // Check if the month is completed or not
    month.monatAbgeschlossen = !(this.isDayBeforeMonth(new Date(), month) ||
      (month.startDate.getFullYear() === new Date().getFullYear() && month.startDate.getMonth() === new Date().getMonth()));

    this.userData.months.push(month);
  }

  private updateBuchungenForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks!.forEach(week => {
      week.days.forEach(day => {
        day.buchungen = this.userData.buchungen.filter(buchung => buchung.data.date?.toLocaleDateString() === day.date.toLocaleDateString());
      })
    })
    /*Algorithm end*/

    this.setMonth(month);
  }

  private updateFixkostenForMonth(startDate: Date) {
    const month = this.getMonthByDate(startDate);
    if (!month.monatAbgeschlossen) {
      month.gesperrteFixKosten = this.userData.standardFixkostenEintraege;
    }
  }

  private calcDailyBudgetForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if (month.daysInMonth === undefined) {
      return;
    }

    if (month.totalBudget === undefined) {
      return;
    }

    month.dailyBudget = +((month.totalBudget - (month.sparen ?? 0) - (this.getFixkostenSummeForMonth(month) ?? 0)) / month.daysInMonth);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcBudgetForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    if (month.daysInMonth === undefined || month.totalBudget === undefined || month.dailyBudget === undefined) {
      return;
    }

    /*Algorithm start*/
    month.budget = +(month.totalBudget - (month.sparen ?? 0) - (this.getFixkostenSummeForMonth(month) ?? 0));
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if (month.dailyBudget === undefined) {
      return;
    }

    let daysLeft: number = month.daysInMonth!;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.budget = +(month.dailyBudget!);
        daysLeft--;
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcBudgetsForAllWeeksInMonth(date: Date) { //TODO
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if (month.dailyBudget === undefined) {
      return;
    }

    month.weeks?.forEach(week => {
      let weekBudget = 0;
      week.days.forEach(day => {
        weekBudget += day.budget!;
      })
      week.budget = +weekBudget;
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcIstBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.istBudget = +(day.budget!);
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcIstBudgetsForAllWeeksInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      let weekIstBudget = 0;
      week.days.forEach(day => {
        if (day.istBudget === undefined) {
          return;
        }
        weekIstBudget += day.istBudget;
      });

      //stellt sicher, dass ein istBudget nur dann exestiert, wenn es auch ein budget gibt
      if (week.budget) {
        week.istBudget = +weekIstBudget;
      }
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcIstBudgetForMonth(date: Date) { //TODO testen
    const month = this.userData.months[this.getIndexOfMonth(date)];

    /*Algorithm start*/
    if (month.budget === undefined) {
      return;
    }
    month.istBudget = +(month.budget - this.getSummeAllerAusgabenForMonth(date));
    /*Algorithm end*/

    this.setMonth(month);
  }

  private save() { //TODO testen
    this.userData.save();
  }

  private sendUpdateToComponents() { //TODO testen
    this.updated.set(this.updated() + 1);
  }


  private getMonthByDate(date: Date) {
    return this.userData.months[this.getIndexOfMonth(date)];
  }

  private setMonth(month: Month) {
    this.userData.months[this.getIndexOfMonth(month.startDate)] = month;
  }

  private getIndexOfMonth(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.userData.months.findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }

  private getSummeAllerAusgabenForMonth(date: Date) { //TODO testen
    const month = this.userData.months[this.getIndexOfMonth(date)];
    let ausgabenSumme = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => {
          ausgabenSumme += (buchung.data.betrag ?? 0);
        })
      })
    })
    return ausgabenSumme;
  }

  private getFixkostenSummeForMonth(month: Month) {
    let summe = 0;
    if (month.monatAbgeschlossen) {
      if (month.gesperrteFixKosten) {
        month.gesperrteFixKosten.forEach(eintrag => {
          summe += eintrag.data.betrag;
        })
      }
    } else {
      if (this.userData.standardFixkostenEintraege === undefined) {
        this.userData.standardFixkostenEintraege = [];
      }
      this.userData.standardFixkostenEintraege.forEach(eintrag => {
        summe += eintrag.data.betrag;
      })
    }
    return summe;
  }

  private getSunday(inputDate: Date): Date {
    // Clone the input date to avoid mutating the original date
    const date = new Date(inputDate);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Calculate the difference to reach Sunday (day 0)
    const diff = 7 - dayOfWeek; // If it's already Sunday, the diff will be 7

    // Set the date to the upcoming Sunday
    date.setDate(date.getDate() + (dayOfWeek === 0 ? 0 : diff));

    // Return the Sunday date
    return date;
  }

  private getNextMonday(date: Date): Date {
    // Create a new date object to avoid mutating the original date
    const result = new Date(date);

    // Get the current day of the week (0 is Sunday, 1 is Monday, etc.)
    const currentDay = result.getDay();

    // Find the offset to the next Monday
    const daysUntilNextMonday = (8 - currentDay) % 7 || 7;

    // Set the date to the next Monday
    result.setDate(result.getDate() + daysUntilNextMonday);

    // Return the next Monday
    return result;
  }

  private isDayBeforeMonth(dayDate: Date, month: Month) {
    if (dayDate.getFullYear() > month.startDate.getFullYear()) {
      return false;
    }
    if(dayDate.getFullYear() < month.startDate.getFullYear()) {
      return true
    }
    return dayDate.getMonth() < month.startDate.getMonth();
  }


  /*
    private getIndexOfWeekInMonth(date: Date): number {
      const monthIndex = this.getIndexOfMonth(date);
      if (monthIndex === -1) {
        return -1;
      }
      const x = this.userData.months()[monthIndex].weeks?.findIndex(week => {
        return week.days.find(day => day.date.toLocaleDateString() === date.toLocaleDateString());
      });

      if (x === undefined) {
        console.log('week not found')
        return -1;
      }
      return x;
    }

    private getIndexOfDayInWeek(date: Date) {
      const monthIndex = this.getIndexOfMonth(date);
      if (monthIndex === -1) {
        return -1;
      }
      if (this.userData.months()[this.getIndexOfMonth(date)].weeks === undefined) {
        return -1;
      }
      const weekIndex = this.getIndexOfWeekInMonth(date);
      if (weekIndex === -1 || weekIndex === undefined) {
        return -1
      }
      return this.userData.months()[this.getIndexOfMonth(date)].weeks![weekIndex].days.findIndex(day => day.date.toLocaleDateString() === date.toLocaleDateString());
    }

    private getIndexOfBuchungById(id: number | undefined) { //TODO testen
      return this.userData.buchungen.alleBuchungen.findIndex(buchung => buchung.id === id);
    }

    private logUndefinedError(varName: string, methodName: string) {
      console.error(`undefined at ${varName} is not allowed! (in: ${methodName})`);
    }

    private getPlannedAusgabenForDay(day: Day) {
      let gesAusgaben = 0;
      day.buchungen?.forEach(buchung => {
        if(!buchung.apz){
          gesAusgaben += buchung.betrag!;
        }
      })
      return gesAusgaben;
    }

    private getLastDayOfMonth(date: Date) {
      const month = this.getMonthByDate(date);
      const week = month.weeks![month.weeks?.length! -1];
      return week.days[week.days.length -1];
    }

    private isMonthSpareintragVorhanden(date: Date) {
      return !(this.userData.sparEintraege.find(eintrag => eintrag.date.toLocaleDateString() === date.toLocaleDateString()) == undefined)
    }*/
}
