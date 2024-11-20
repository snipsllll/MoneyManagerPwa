import { Injectable } from '@angular/core';
import {
  IBuchung,
  IDay,
  IFixkostenEintrag,
  IMonth,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "../../Models/NewInterfaces";
import {DataService} from "../DataService/data.service";
import {AvailableMoney, BudgetInfosForMonth, Day, Month, Settings} from "../../Models/Interfaces";
import {UT} from "../../Models/Classes/UT";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private utils = new UT();

  constructor(private dataService: DataService) { }

  getUnspendMoneyForMonth(month: IMonth): number | undefined {
    return undefined;
  }

  getAlleBuchungen(): IBuchung[] {
    return this.dataService.userData.buchungen;
  }

  getAlleBuchungenForMonth(month: IMonth): IBuchung[] {
    return [];
  }

  getAlleBuchungenForDay(day: IDay): IBuchung[] {
    return [];
  }

  getAlleFixkostenEintraegeForMonth(month: IMonth): IFixkostenEintrag[] {
    return [];
  }

  getAlleWunschlistenEintraege(): IWunschlistenEintrag[] {
    return this.dataService.userData.wunschlistenEintraege;
  }

  getAlleSparschweinEintraege(): ISparschweinEintrag[] {
    const sparschweinEintraege = this.dataService.userData.sparschweinEintraege;
    const months = this.dataService.userData.months;
    months.forEach(month => {
      if(month.monatAbgeschlossen) {
        sparschweinEintraege.push(
          {
            id: -1,
            data: {
              betrag: month.istBudget!,
              date: month.endDate!,
              title: `Restgeld für ${month.startDate.toLocaleDateString()}`,
              vonMonat: true
            }
          }
        )
      }
    })

    return sparschweinEintraege;
  }

  getAusgabenBetragForDay(day: IDay): number | undefined {
    return undefined;
  }

  getAnzahlDaysLeftForMonth(date: Date) {
    const month = this.getMonthByDate(date);
    return month.daysInMonth! - date.getDate();
  }

  getErspartes() {
    let eintraege = this.dataService.userData.sparschweinEintraege;
    let erspartes = 0;

    eintraege.forEach(eintrag => {
      erspartes += eintrag.data.betrag;
    })

    return +(erspartes);
  }

  getBuchungById(buchungsId: number) {
    return this.dataService.userData.buchungen.find(buchung => buchung.id === buchungsId);
  }

  getDayByeDate(date: Date): Day | undefined {
    const month = this.getMonthByDate(date);
    let selectedDay: Day | undefined = undefined;

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if(day.date.toLocaleDateString() === date.toLocaleDateString()) {
          selectedDay =  day;
        }
      })
    })

    return selectedDay;
  }

  getAllDays() {
    const months: Month[] = this.dataService.userData.months;
    const days: Day[] = []
    months.forEach(month => {
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          if(day.buchungen && day.buchungen.length > 0){
            days.push(day);
          }
        })
      })
    });
    return days;
  }

  getAvailableMoneyForDay(dayDate: Date): number {
    const month = this.getMonthByDate(dayDate);
    const x = this.getDictForDayBudgetsInMonth(dayDate);

    let isDayReached = false;
    let daysLeftOver = month.daysInMonth!;
    let notSpendMoney = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if(!isDayReached){
          if(day.date.getDate() === dayDate.getDate()){
            isDayReached = true;
          }

          let moneySpendOnDay = 0;
          day.buchungen?.forEach(buchung => {
            /*
            if(!buchung.apz) {
              moneySpendOnDay += buchung.betrag!;
            }*/
          })

          notSpendMoney += x[day.date.toLocaleDateString()] - moneySpendOnDay;
          daysLeftOver--;
        }
      })
    })

    return notSpendMoney;
  }

  getAvailableMoney(dayDate: Date): AvailableMoney {
    if(this.getMonthByDate(dayDate).totalBudget === undefined || this.getMonthByDate(dayDate).totalBudget === 0){
      return {
        availableForMonth: -0,
        availableForWeek: -0,
        availableForDay: -0
      };
    }
    const availableForDay = this.getAvailableMoneyForDay(dayDate);
    const daySollBudgets = this.getDictForDayBudgetsInMonth(dayDate);

    let availableForWeek = 0;
    let isDayReached = false;
    this.getMonthByDate(dayDate).weeks![this.getIndexOfWeekInMonth(dayDate)].days.forEach(day => {
      if(day.date.getDate() === dayDate.getDate()) {
        isDayReached = true;
      }
      if(isDayReached) {
        availableForWeek += daySollBudgets[day.date.toLocaleDateString()];
      }
    })
    availableForWeek += availableForDay;

    const availableForMonth = this.getMonthByDate(dayDate).istBudget!;

    return {
      availableForDay: availableForDay,
      availableForWeek: availableForWeek,
      availableForMonth: availableForMonth
    }
  }

  getFixkostenSummeForMonth(month: Month) {
    let summe = 0;
    if (month.monatAbgeschlossen) {
      if (month.gesperrteFixKosten) {
        month.gesperrteFixKosten.forEach(eintrag => {
          summe += eintrag.data.betrag;
        })
      }
    } else {
      if (this.dataService.userData.fixkostenEintraege === undefined) {
        this.dataService.userData.fixkostenEintraege = [];
      }
      this.dataService.userData.fixkostenEintraege.forEach(eintrag => {
        summe += eintrag.data.betrag;
      })
    }
    return summe;
  }

  checkIfMonthExistsForDay(date: Date) {
    return this.dataService.userData.months.findIndex(month => month.startDate.getMonth() === date.getMonth() && month.startDate.getFullYear() === date.getFullYear()) !== -1;
  }

  isDayBeforeMonth(dayDate: Date, month: Month) {
    if (dayDate.getFullYear() > month.startDate.getFullYear()) {
      return false;
    }
    if(dayDate.getFullYear() < month.startDate.getFullYear()) {
      return true
    }
    return dayDate.getMonth() < month.startDate.getMonth();
  }

  getMonthByDate(date: Date) {
    return this.dataService.userData.months[this.getIndexOfMonth(date)];
  }

  getSettings(): Settings {
    return this.dataService.userData.settings;
  }

  getBudgetInfosForMonth(date: Date): BudgetInfosForMonth | null {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return null;
    }
    const month = this.dataService.userData.months[monthIndex];

    return {
      budget: month.budget ?? 0,
      sparen: month.sparen ?? 0,
      totalBudget: month.totalBudget ?? 0,
      istBudget: month.istBudget,
      dayBudget: month.dailyBudget ?? 0,
      fixKostenSumme: this.getFixkostenSummeForMonth(month),
      fixKostenGesperrt: month.monatAbgeschlossen ?? false,
      fixKostenEintraege: month.monatAbgeschlossen ? month.gesperrteFixKosten : this.dataService.userData.fixkostenEintraege
    }
  }

  private getDictForDayBudgetsInMonth(monthDate: Date) {
    const month = this.getMonthByDate(monthDate);

    let dict: {[date: string]: number} = {};
    let budget = month.budget!;
    let daysLeft = month.daysInMonth!;

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => {
          /*
          if(buchung.apz) {
            budget -= buchung.betrag!;
          }*/
        })
        dict[day.date.toLocaleDateString()] = budget / daysLeft;
        budget -= dict[day.date.toLocaleDateString()];
        daysLeft--;
      })
    })

    return dict;
  }

  private getIndexOfWeekInMonth(date: Date): number {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return -1;
    }
    const x = this.dataService.userData.months[monthIndex].weeks?.findIndex(week => {
      return week.days.find(day => day.date.toLocaleDateString() === date.toLocaleDateString());
    });

    if (x === undefined) {
      console.log('week not found')
      return -1;
    }
    return x;
  }

  private getIndexOfMonth(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.dataService.userData.months.findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }
}
