import {Injectable} from '@angular/core';
import {
  IBuchung,
  IDay,
  IFixkostenEintrag,
  IMonth, IMonthFixkostenEintrag,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "../../Models/NewInterfaces";
import {DataService} from "../DataService/data.service";
import {AvailableMoney, BudgetInfosForMonth, Day, Month, Settings} from "../../Models/Interfaces";
import {UT} from "../../Models/Classes/UT";
import {Months} from "../../Models/Enums";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private utils = new UT();

  constructor(private dataService: DataService) {
  }

  getAlleWunschlistenEintraege(): IWunschlistenEintrag[] {
    return this.dataService.userData.wunschlistenEintraege;
  }

  getAlleSparschweinEintraege(): ISparschweinEintrag[] {
    const sparschweinEintraege = this.utils.clone(this.dataService.userData.sparschweinEintraege) as ISparschweinEintrag[];
    const months = this.dataService.userData.months;
    months.forEach(month => {
      if (month.monatAbgeschlossen) {
        sparschweinEintraege.push(
          {
            id: -1,
            data: {
              betrag: month.istBudget!,
              date: month.endDate!,
              title: this.getMonatJahrTextForMonth(month),
              vonMonat: true
            }
          }
        )
      }
    })

    return sparschweinEintraege;
  }

  getFixkostenEintraegeForMonth(date: Date, onlyIncluded?: boolean) {
    const month = this.getMonthByDate(date);

    const a: IMonthFixkostenEintrag[] = (month && month.specialFixkostenEintraege ? month.specialFixkostenEintraege : []).map((eintrag): IMonthFixkostenEintrag => {
      return {
        id: eintrag.id,
        data: {
          isStandardFixkostenEintrag: false,
          ...eintrag.data
        }
      }
    })

    const b: IMonthFixkostenEintrag[] = (month && month.uebernommeneStandardFixkostenEintraege ? month.uebernommeneStandardFixkostenEintraege : []).map((eintrag): IMonthFixkostenEintrag => {
      return {
        id: eintrag.id,
        data: {
          isStandardFixkostenEintrag: true,
          ...eintrag.data
        }
      }
    })

    let alleEintraege =  b.concat(a);

    if(onlyIncluded) {
      alleEintraege = alleEintraege.filter(eintrag => eintrag.data.isExcluded !== true);
    }

    return alleEintraege;
  }

  getAnzahlDaysLeftForMonth(date: Date) {
    const month = this.getMonthByDate(date);
    return month.daysInMonth! - date.getDate();
  }

  getErspartes() {
    let eintraege = this.getAlleSparschweinEintraege();
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
        if (day.date.toLocaleDateString() === date.toLocaleDateString()) {
          selectedDay = day;
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
          if (day.buchungen && day.buchungen.length > 0) {
            days.push(day);
          }
        })
      })
    });
    return days;
  }

  getAlleBuchungenForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    const alleBuchungen: IBuchung[] = [];

    month.weeks?.forEach(week => {
      week.days?.forEach(day => {
        day.buchungen?.forEach(buchung => {
          alleBuchungen.push(buchung);
        })
      })
    });

    return alleBuchungen;
  }

  getAvailableMoneyForDay(dayDate: Date): number {
    const month = this.getMonthByDate(dayDate);
    const x = this.getDictForDayBudgetsInMonth(dayDate);

    let isDayReached = false;
    let daysLeftOver = month.daysInMonth!;
    let notSpendMoney = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if (!isDayReached) {
          if (day.date.getDate() === dayDate.getDate()) {
            isDayReached = true;
          }

          let moneySpendOnDay = 0;
          day.buchungen?.forEach(buchung => {
            moneySpendOnDay += buchung.data.betrag!;
          })

          notSpendMoney += x[day.date.toLocaleDateString()] - moneySpendOnDay;
          daysLeftOver--;
        }
      })
    })
    return notSpendMoney;
  }

  getAvailableMoneyForDayFromSoll(date: Date) {
    const month = this.getMonthByDate(date);

    return (month.dailyBudget ?? 0) - this.getAusgabenForDay(date);
  }

  getAusgabenForDay(date: Date) {
    const day = this.getDayByeDate(date);
    console.log(day)
    let ausgaben = 0;

    day?.buchungen?.forEach(buchung => {
      ausgaben += buchung.data.betrag ?? 0;
    });

    return ausgaben;
  }

  getAvailableMoney(dayDate: Date): AvailableMoney {
    if (this.getMonthByDate(dayDate).totalBudget === undefined || this.getMonthByDate(dayDate).totalBudget === 0) {
      return {
        availableForMonth: -0,
        availableForWeek: -0,
        availableForDay: -0,
        noData: true
      };
    }
    const availableForDay = this.getAvailableMoneyForDay(dayDate);
    const daySollBudgets = this.getDictForDayBudgetsInMonth(dayDate);

    let availableForWeek = 0;
    let isDayReached = false;
    this.getMonthByDate(dayDate).weeks![this.getIndexOfWeekInMonth(dayDate)].days.forEach(day => {
      if (day.date.getDate() === dayDate.getDate()) {
        isDayReached = true;
      }
      if (isDayReached) {
        availableForWeek += daySollBudgets[day.date.toLocaleDateString()];
      }
    })
    availableForWeek += availableForDay;

    const availableForMonth = this.getMonthByDate(dayDate).istBudget!;

    return {
      availableForDay: availableForDay,
      availableForWeek: availableForWeek,
      availableForMonth: availableForMonth,
      noData: false
    }
  }

  getAvailableMoneyCapped(dayDate: Date): AvailableMoney {
    const availableMoney = this.getAvailableMoney(dayDate);

    availableMoney.availableForDay = availableMoney.availableForDay > 0 ? availableMoney.availableForDay : 0;
    availableMoney.availableForWeek = availableMoney.availableForWeek > 0 ? availableMoney.availableForWeek : 0;
    availableMoney.availableForMonth = availableMoney.availableForMonth > 0 ? availableMoney.availableForMonth : 0;

    return availableMoney;
  }

  getFixkostenSummeForMonth(month: Month) {
    let summe = 0;
    const eintraege = this.getFixkostenEintraegeForMonth(month.startDate, true);
    if (!eintraege)
      return 0;

    eintraege.forEach(eintrag => {
      summe += eintrag.data.betrag;
    })
    return summe;
  }

  checkIfMonthExistsForDay(date: Date) {
    return this.dataService.userData.months.findIndex(month => month.startDate.getMonth() === date.getMonth() && month.startDate.getFullYear() === date.getFullYear()) !== -1;
  }

  isDayBeforeMonth(dayDate: Date, month: Month) {
    if (dayDate.getFullYear() > month.startDate.getFullYear()) {
      return false;
    }
    if (dayDate.getFullYear() < month.startDate.getFullYear()) {
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
      fixKostenEintraege: this.getFixkostenEintraegeForMonth(month.startDate, true)
    }
  }

  getBuchungsKategorienNamen() {
    return this.dataService.userData.getKategorienNamen();
  }

  getBuchungsKategorien() {
    return this.dataService.userData.buchungsKategorien;
  }

  getBuchungsKategorieNameById(id: number) {
    const kategorie = this.dataService.userData.buchungsKategorien.find(k => k.id === id);
    return kategorie ? kategorie.name : 'Kategorie nicht gefunden';
  }

  getAllMonthsForYear(year: number) {
    const months = this.dataService.userData.months;
    return months.filter(month => month.startDate.getFullYear() === year);
  }

  private getDictForDayBudgetsInMonth(monthDate: Date) {
    const month = this.getMonthByDate(monthDate);

    let dict: { [date: string]: number } = {};
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

  private getMonatJahrTextForMonth(month: Month) {
    let monthText: string = '';

    switch (month.startDate.getMonth()) {
      case 0:
        monthText = 'Januar';
        break;
      case 1:
        monthText = 'Februar';
        break;
      case 2:
        monthText = 'März';
        break;
      case 3:
        monthText = 'April';
        break;
      case 4:
        monthText = 'Mai';
        break;
      case 5:
        monthText = 'Juni';
        break;
      case 6:
        monthText = 'Juli';
        break;
      case 7:
        monthText = 'August';
        break;
      case 8:
        monthText = 'September';
        break;
      case 9:
        monthText = 'Oktober';
        break;
      case 10:
        monthText = 'November';
        break;
      case 11:
        monthText = 'Dezember';
        break;
    }

    const yearText = month.startDate.getFullYear().toString();

    return `Restgeld von ${monthText} ${yearText}`;
  }
}
