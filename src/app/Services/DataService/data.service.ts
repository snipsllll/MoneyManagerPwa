import {Injectable, signal} from '@angular/core';
import {UserData} from "../../Models/Classes/UserData";
import {Day, IGeplanteAusgabenBuchung, Month, Week} from "../../Models/Interfaces";
import {IBuchung, IMonthFixkostenEintrag} from "../../Models/NewInterfaces";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData = new UserData();
  updated = signal<number>(0);

  constructor() {
    this.update(false);
  }

  triggerUpdated() {
    this.updated.set(this.updated() + 1);
  }

  update(safeAfterUpdate?: boolean) {
    //Wenn für den 'heutigen Tag (new Date())' noch kein Monat vorhanden ist, dann erstelle einen neuenn monat für den 'heutigen Tag'
    if (!this.checkIfMonthExistsForDay(new Date())) {
      this.createNewMonth(new Date());
    }

    /*Weird and crazy stuff beginns here*/
    this.userData.months.forEach(month => {
      this.updateBuchungenForMonth(month.startDate);

      this.updateGeplanteAusgabenForMonth(month.startDate);

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
      weeks: weeks,
      uebernommeneStandardFixkostenEintraege: this.userData.standardFixkostenEintraege ? this.userData.standardFixkostenEintraege : [],
      specialFixkostenEintraege: []
    };

    // Check if the month is completed or not
    month.monatAbgeschlossen = !(this.isDayBeforeMonth(new Date(), month) ||
      (month.startDate.getFullYear() === new Date().getFullYear() && month.startDate.getMonth() === new Date().getMonth()));

    this.userData.months.push(month);
  }

  private updateGeplanteAusgabenForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    // Zuerst die Buchungen in eine Map umwandeln, wobei das Datum der Schlüssel ist
    const geplanteAusgabenMap = new Map<string, IGeplanteAusgabenBuchung[]>();

    // Daten einmal durchgehen und in der Map organisieren
    this.userData.geplanteAusgabenBuchungen.forEach(geplanteAusgabe => {
      const geplanteAusgabenDateStr = geplanteAusgabe.data.date?.toLocaleDateString();
      if (geplanteAusgabenDateStr) {
        if (!geplanteAusgabenMap.has(geplanteAusgabenDateStr)) {
          geplanteAusgabenMap.set(geplanteAusgabenDateStr, []);
        }
        geplanteAusgabenMap.get(geplanteAusgabenDateStr)!.push(geplanteAusgabe);
      }
    });

    // Jetzt durch die Wochen und Tage des Monats gehen und Buchungen zuweisen
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        const dayDateStr = day.date.toLocaleDateString();
        // Buchungen direkt aus der Map holen
        day.geplanteAusgabenBuchungen = geplanteAusgabenMap.get(dayDateStr) || [];
      });
    });

    this.setMonth(month);
  }

  private updateBuchungenForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    // Zuerst die Buchungen in eine Map umwandeln, wobei das Datum der Schlüssel ist
    const buchungenMap = new Map<string, IBuchung[]>();

    // Daten einmal durchgehen und in der Map organisieren
    this.userData.buchungen.forEach(buchung => {
      const buchungDateStr = buchung.data.date?.toLocaleDateString();
      if (buchungDateStr) {
        if (!buchungenMap.has(buchungDateStr)) {
          buchungenMap.set(buchungDateStr, []);
        }
        buchungenMap.get(buchungDateStr)!.push(buchung);
      }
    });

    // Jetzt durch die Wochen und Tage des Monats gehen und Buchungen zuweisen
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        const dayDateStr = day.date.toLocaleDateString();
        // Buchungen direkt aus der Map holen
        day.buchungen = buchungenMap.get(dayDateStr) || [];
      });
    });

    this.setMonth(month);
  }

  private updateFixkostenForMonth(startDate: Date) {
    const month = this.getMonthByDate(startDate);
    if (!month.monatAbgeschlossen && this.userData.standardFixkostenEintraege) {
      this.userData.standardFixkostenEintraege.forEach(standardEintrag => {
        if(month.uebernommeneStandardFixkostenEintraege?.findIndex(eintragx => standardEintrag.id === eintragx.id) === -1) {
          //nicht eingefügte standardfixkosten einfügen
          month.uebernommeneStandardFixkostenEintraege.push({
            id: standardEintrag.id,
            data: {
              betrag: standardEintrag.data.betrag,
              title: standardEintrag.data.title,
              zusatz: standardEintrag.data.zusatz,
              isStandardFixkostenEintrag: true,
              isExcluded: false
            }
          });
        } else {
          //geänderte standardfixkosten anpassen
          const eintrag = month.uebernommeneStandardFixkostenEintraege?.find(eintragx => standardEintrag.id === eintragx.id)!
          if(eintrag.data.title !== standardEintrag.data.title || eintrag.data.betrag !== standardEintrag.data.betrag || eintrag.data.zusatz !== standardEintrag.data.zusatz) {
            console.log(eintrag)
            month.uebernommeneStandardFixkostenEintraege![month.uebernommeneStandardFixkostenEintraege!.findIndex(eintragx => standardEintrag.id === eintragx.id)] = standardEintrag;
          }
        }
      })
    }

    //gelöschte standardFixckosteneintraege die aber noch in den uebernommenen drin sind löschen
    if(!month.monatAbgeschlossen) {
      month.uebernommeneStandardFixkostenEintraege?.forEach(eintrag => {
        if (this.userData.standardFixkostenEintraege?.findIndex(standardEintrag => standardEintrag.id === eintrag.id) === -1) {
          month.uebernommeneStandardFixkostenEintraege!.splice(month.uebernommeneStandardFixkostenEintraege!.findIndex(x => x.id === eintrag.id)!, 1);
        }
      })
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

    month.dailyBudget = +((month.totalBudget - (month.sparen ?? 0) - (this.getFixkostenSummeForMonth(month) ?? 0) - (this.getGeplanteAusgabenSumme(month) ?? 0)) / month.daysInMonth);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcBudgetForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    if (month.daysInMonth === undefined || month.totalBudget === undefined || month.dailyBudget === undefined) {
      return;
    }

    /*Algorithm start*/
    month.budget = +(month.totalBudget - (month.sparen ?? 0) - (this.getFixkostenSummeForMonth(month) ?? 0) - (this.getGeplanteAusgabenSumme(month) ?? 0));
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
        day.buchungen?.forEach(buchung => {
          day.istBudget! -= buchung.data.betrag ?? 0;
        })
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

  private getGeplanteAusgabenEintraegeForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    return month.geplanteAusgaben;
  }

  private getFixkostenEintraegeForMonth(date: Date, onlyIncluded?: boolean) {
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

    let alleEintraege =  a.concat(b);

    if(onlyIncluded) {
      alleEintraege = alleEintraege.filter(eintrag => eintrag.data.isExcluded !== true);
    }

    return alleEintraege;
  }

  private getFixkostenSummeForMonth(month: Month) {
    let summe = 0;
    const alleEintraege = this.getFixkostenEintraegeForMonth(month.startDate, true);
    alleEintraege.forEach(eintrag => {
      summe += eintrag.data.betrag;
    })
    return summe;
  }


  private getGeplanteAusgabenSumme(month: Month) {
    let summe = 0;
    const alleEintraege = this.getGeplanteAusgabenEintraegeForMonth(month.startDate) ?? [];
    alleEintraege.forEach(eintrag => {
      summe += eintrag.data.betrag;
    })
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
