import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData!: UserData;
  testData: DB = DB.none;
  download: boolean = true;

  updated = signal<number>(0);

  private _fileEngine = new FileEngine(this.testData, this.download);

  constructor() {
    this.initializeUserData();
  }

  addBuchung(buchung: Buchung) {
    buchung.id = this.getNextFreeBuchungsId();
    this.update({
      newBuchungen: [buchung]
    });
  }

  editBuchung(buchung: Buchung) {
    this.update({
      editedBuchungen: [buchung]
    });
  }

  deleteBuchung(buchungsId: number) {
    this.update({
      deletedBuchungsIds: [buchungsId]
    })
  }

  addFixKostenEintrag(fixkostenEintrag: FixKostenEintrag) {
    this.update({
      newFixkostenEintraege: [fixkostenEintrag]
    })
  }

  editFixKostenEintrag(fixkostenEintrag: FixKostenEintrag) {
    this.update({
      editedFixKostenEintraege: [fixkostenEintrag]
    })
  }

  deleteFixKostenEintrag(fixkostenEintragsId: number) {
    this.update( {
      deletedFixkostenEintreageIds: [fixkostenEintragsId]
    })
  }

  changeSparenForMonth(date: Date, sparen: number, saveAfterUpdate?: boolean) {
    this.update({
      months: [
        {
          date: date,
          newSparen: sparen
        }
      ]
    }, saveAfterUpdate)
  }

  changeTotalBudgetForMonth(date: Date, totalBudget: number, saveAfterUpdate?: boolean) {
    this.update({
      months: [
        {
          date: date,
          newTotalBudget: totalBudget
        }
      ]
    }, saveAfterUpdate)
  }

  update(updateValues?: UpdateValues, safeAfterUpdate?: boolean) {
    if(updateValues) {
      //Wenn neue Fixkosteneinträge vorhanden, dann zu userData.fixKosten hinzufügen
      if(updateValues.newFixkostenEintraege !== undefined) {
        updateValues.newFixkostenEintraege.forEach(fixKostenEintrag => {
          this.userData.fixKosten.push(fixKostenEintrag);
        })
      }

      //Wenn FixkostenEinträge gelöscht wurden, dann aus userData.fixKosten entfernen
      if(updateValues.deletedFixkostenEintreageIds !== undefined) {
        updateValues.deletedFixkostenEintreageIds.forEach(fixKostenEintragsId => {
          this.userData.fixKosten.splice(this.getFixKostenIndex(fixKostenEintragsId!),1);
        })
      }

      //Wenn Fixkosteneinträge verändert wurden, dann in userData.fixKosten anpassen
      if(updateValues.newFixkostenEintraege !== undefined) {
        updateValues.newFixkostenEintraege.forEach(fixKostenEintrag => {
          this.userData.fixKosten[this.getFixKostenIndex(fixKostenEintrag.id!)] = fixKostenEintrag;
        })
      }

      //Wenn neue Buchungen angelegt wurden, dann neue Buchungen zu userData.buchungen.allebuchungen hinzufügen
      if(updateValues.newBuchungen !== undefined) {
        updateValues.newBuchungen.forEach(buchung => {
          this.userData.buchungen.alleBuchungen.push(buchung);
        })
      }

      //Wenn Buchungen gelöscht wurden, dann Buchungen aus userData.buchungen.alleBuchungen entfernen
      if(updateValues.deletedBuchungsIds !== undefined){
        updateValues.deletedBuchungsIds.forEach(buchungsId => {
          this.userData.buchungen.alleBuchungen.splice(this.getIndexOfBuchungById(buchungsId), 1);
        })
      }

      //Wenns bearbeitete Buchungen gibt, dann Buchungen in userData.buchungen.alleBuchungen anpassen
      if(updateValues.editedBuchungen !== undefined) {
        updateValues.editedBuchungen.forEach(buchung => {
          this.userData.buchungen.alleBuchungen[this.getIndexOfBuchungById(buchung.id)] = buchung;
        })
      }

      if(updateValues.months){
        updateValues.months.forEach(month => {
          if(!this.checkIfMonthExistsForDay(month.date)){
            this.createNewMonth(month.date);
          }

          //Wenn sparen geändert wurde
          if(month.newSparen !== undefined) {
            this.userData.months()[this.getIndexOfMonth(month.date)].sparen = month.newSparen;
          }

          //Wenn totalBudget geändert wurde
          if(month.newTotalBudget !== undefined) {
            this.userData.months()[this.getIndexOfMonth(month.date)].totalBudget = month.newTotalBudget;
          }

          //Wenn maxDayBudget geändert wurde
          if(month.newMaxDayBudget !== undefined) {
            //TODO
          }
        })
      }
    }

    /*Weird and crazy stuff beginns here*/
    this.userData.months().forEach(month => {
      //Buchungen in Monat zu den jeweiligen Tagen hinzufügen/updaten
      this.updateBuchungenForMonth(month.startDate);

      this.calcDailyBudgetForMonth(month.startDate);

      this.calcBudgetForMonth(month.startDate);

      this.calcBudgetsForAllDaysInMonth(month.startDate);

      this.calcBudgetsForAllWeeksInMonth(month.startDate);

      this.calcIstBudgetsForAllDaysInMonth(month.startDate);

      this.calcIstBudgetsForAllWeeksInMonth(month.startDate);

      this.calcIstBudgetForMonth(month.startDate);

      this.calcLeftOversForAllDaysInMonth(month.startDate);

      this.calcLeftOversForAllWeeksInMonth(month.startDate);

      this.calcLeftOversForMonth(month.startDate);
    });
    if(safeAfterUpdate === undefined || safeAfterUpdate === true){
      this.save();
    }
    this.sendUpdateToComponents();
  }

  getDayIstBudgets(date: Date): DayIstBudgets | null {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return null;
    }
    const month = this.userData.months()[monthIndex];

    const weekIndex = this.getIndexOfWeekInMonth(date);
    if (weekIndex === -1) {
      return null;
    }
    const week = this.userData.months()[monthIndex].weeks![this.getIndexOfWeekInMonth(date)];

    const dayIndex = this.getIndexOfDayInWeek(date);
    if (dayIndex === -1) {
      return null;
    }
    const day = this.userData.months()[monthIndex].weeks![weekIndex].days![dayIndex];

    return {
      dayIstBudget: day.istBudget ?? undefined,
      weekIstBudget: week.istBudget ?? undefined,
      monthIstBudget: month.istBudget ?? undefined
    }
  }

  getBudgetInfosForMonth(date: Date): BudgetInfosForMonth | null {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return null;
    }
    const month = this.userData.months()[monthIndex];

    return {
      budget: month.budget ?? 0,
      sparen: month.sparen ?? 0,
      totalBudget: month.totalBudget ?? 0,
      istBudget: month.istBudget,
      dayBudget: month.dailyBudget ?? 0,
      fixKosten: this.getFixKostenSumme()
    }
  }

  getBuchungById(buchungsId: number) {
    return this.userData.buchungen.alleBuchungen.find(buchung => buchung.id === buchungsId);
  }

  getFixKostenSumme() {
    let summe = 0;
    if(this.userData.fixKosten === undefined) {
      this.userData.fixKosten = [];
    }
    this.userData.fixKosten.forEach(eintrag => {
      summe += eintrag.betrag;
    })
    return summe;
  }

  private getIndexOfMonth(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.userData.months().findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }

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

  private checkIfMonthExistsForDay(date: Date): boolean {
    return this.userData.months().findIndex(month => month.startDate.getMonth() === date.getMonth()) !== -1;
  }

  private getSavedData(): SavedData {
    const savedData: SavedData = {
      buchungen: [],
      savedMonths: [],
      fixKosten: []
    }

    savedData.buchungen = this.userData.buchungen.alleBuchungen;
    savedData.fixKosten = this.userData.fixKosten;

    this.userData.months().forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget ?? 0,
        sparen: month.sparen ?? 0
      })
    })

    return savedData;
  }

  private initializeUserData() {
    const savedData = this._fileEngine.load();

    //Converting SavedData to UserData
    this.userData = new UserData();
    this.userData.buchungen.alleBuchungen = savedData.buchungen;
    this.userData.fixKosten = savedData.fixKosten;

    savedData.savedMonths?.forEach(month => {
      if(!this.checkIfMonthExistsForDay(month.date)){
        this.createNewMonth(month.date);
      }
      this.changeSparenForMonth(month.date, month.sparen, false);
      this.changeTotalBudgetForMonth(month.date, month.totalBudget, false);
    });

    this.update({}, false);
  }

  private getNextFreeBuchungsId() {
    let freeId = 1;
    for (let i = 0; i < this.userData.buchungen.alleBuchungen.length; i++) {
      if (this.userData.buchungen.alleBuchungen.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }
  private getMonday(inputDate: Date): Date {
    // Clone the input date to avoid mutating the original date
    const date = new Date(inputDate);

    // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = date.getDay();

    // Calculate the difference between the current day and Monday (day 1)
    const diff = (dayOfWeek + 6) % 7; // This ensures Sunday goes back 6 days, Monday stays at 0

    // Set the date to the Monday of the current week
    date.setDate(date.getDate() - diff);

    // Return the Monday date
    return date;
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

  private getNextFreeFixKostenId() {
    let freeId = 1;
    for (let i = 0; i < this.userData.fixKosten.length; i++) {
      if (this.userData.fixKosten.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getFixKostenIndex(id: number) {
    return this.userData.fixKosten.findIndex(eintrag => eintrag.id === id);
  }

  private calcIstBudgetForMonth(date: Date) { //TODO testen
    const month = this.userData.months()[this.getIndexOfMonth(date)];

    /*Algorithm start*/
    if(month.budget === undefined) {
      console.error('undefined at month.budget is not allowed! (dataService: calcIstBudgetForMonth)');
      return;
    }
    month.istBudget = +(month.budget - this.getAusgabenSummeForMonth(date)).toFixed(2);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcIstBudgetsForAllWeeksInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      let weekIstBudget = 0;
      week.days.forEach(day => {
        if(day.istBudget === undefined) {
          this.logUndefinedError('day.istBudget', 'calcIstBudgetForAllWekksInMonth()');
          return;
        }
        weekIstBudget += day.istBudget;
      });
      week.istBudget = +weekIstBudget.toFixed(2);
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcIstBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if(day.budget === undefined) {
          this.logUndefinedError('day.budget', 'calcIstBudgetsForAllDaysInMonth()');
          return;
        }
        let dayAusgaben = 0;
        day.buchungen?.forEach(buchung => {
          dayAusgaben += (buchung.betrag ?? 0);
        })
        day.istBudget = +(day.budget - dayAusgaben).toFixed(2);
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcBudgetsForAllWeeksInMonth(date: Date) { //TODO
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if(month.dailyBudget === undefined) {
      this.logUndefinedError('month.dailyBudget', 'calcBudgetsForAllWeeksInMonth()');
      return;
    }

    month.weeks?.forEach(week => {
      if(month.dailyBudget === undefined) {
        this.logUndefinedError('week.daysInWeek', 'calcBudgetsForAllWeeksInMonth()');
        return;
      }
      week.budget = +(week.daysInWeek * month.dailyBudget!).toFixed(2);
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if(month.dailyBudget === undefined) {
      this.logUndefinedError('month.dailyBudget', 'calcBudgetsForAllDaysInMonth()');
      return;
    }

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.budget = month.dailyBudget;
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
  }

  private calcDailyBudgetForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if(month.daysInMonth === undefined) {
      this.logUndefinedError('month.daysInMonth', 'calcDailyBudgetForMonth()');
      return;
    }

    if(month.totalBudget === undefined) {
      this.logUndefinedError('month.totalBudget', 'calcDailyBudgetForMonth');
      return;
    }

    month.dailyBudget = +((month.totalBudget - (month.sparen ?? 0) - (this.getFixKostenSumme() ?? 0)) / month.daysInMonth).toFixed(2);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcDaysInMonthForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    /*Algorithm end*/

    this.setMonth(month);
  }

  private updateBuchungenForMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks!.forEach(week => {
      week.days.forEach(day => {
        day.buchungen = this.userData.buchungen.alleBuchungen.filter(buchung => buchung.date.toLocaleDateString() === day.date.toLocaleDateString());
      })
    })
    /*Algorithm end*/

    this.setMonth(month);
  }

  private getIndexOfBuchungById(id: number | undefined) { //TODO testen
    return this.userData.buchungen.alleBuchungen.findIndex(buchung => buchung.id === id);
  }

  createNewMonth(date: Date) { //TODO
    const startDate: Date = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate: Date = new Date(date.getFullYear(), date.getMonth() + 1, 0); //TODO testen
    const daysInMonth: number = endDate.getDate() - startDate.getDate() + 1;

    const weeks: Week[] = [];

    let weekStartDate = startDate;

    while(weekStartDate.getDate() <= endDate.getDate() && weekStartDate.getMonth() <= endDate.getMonth()) {
      let weekEndDate: Date = this.getSunday(weekStartDate);

      if(weekEndDate.getMonth() > endDate.getMonth()){
        weekEndDate = endDate;
      }

      const daysInWeek = weekEndDate.getDate() - weekStartDate.getDate() + 1; //TODO testen
      const days: Day[] = [];

      for (let d = weekStartDate.getDate(); d <= weekEndDate.getDate(); d++) {
        const dateForDay = new Date(weekStartDate.getFullYear(), weekStartDate.getMonth(), d);
        days.push({date: dateForDay});
      }

      weeks.push({
        startDate: weekStartDate,
        endDate: weekEndDate,
        daysInWeek: daysInWeek,
        days: days
      });

      weekStartDate = this.getNextMonday(weekStartDate);
    }

    const month: Month = {
      startDate: startDate,
      endDate: endDate,
      daysInMonth: daysInMonth,
      weeks: weeks
    }

    this.userData.months().push(month);
  }

  private save() { //TODO testen
    this._fileEngine.save(this.getSavedData());
  }

  private sendUpdateToComponents() { //TODO testen
    this.updated.set(this.updated() + 1);
  }

  private getAusgabenSummeForMonth(date: Date) { //TODO testen
    const month = this.userData.months()[this.getIndexOfMonth(date)];
    let ausgabenSumme = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => {
          ausgabenSumme += (buchung.betrag ?? 0);
        })
      })
    })
    return ausgabenSumme;
  }

  private getMonthByDate(date: Date) {
    return this.userData.months()[this.getIndexOfMonth(date)];
  }

  private logUndefinedError(varName: string, methodName: string) {
    console.error(`undefined at ${varName} is not allowed! (in: ${methodName})`);
  }

  private setMonth(month: Month) {
    this.userData.months()[this.getIndexOfMonth(month.startDate)] = month;
  }

  private calcBudgetForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    if(month.daysInMonth === undefined || month.totalBudget === undefined || month.dailyBudget === undefined) {
      this.logUndefinedError('something', 'calcBubdgetForMonth()');
      return;
    }

    /*Algorithm start*/
    month.budget = +(month.dailyBudget * month.daysInMonth).toFixed(2);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcLeftOversForAllDaysInMonth(date: Date) {
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.leftOvers = day.istBudget;
      })
    })
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcLeftOversForAllWeeksInMonth(date: Date) {
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      let leftovers = 0;
      week.days.forEach(day => {
        if(day.date.getDate() < new Date().getDate()){
          leftovers += day.leftOvers ?? 0;
        }
      })
      week.leftOvers = leftovers;
    })
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcLeftOversForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    let leftovers = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if(day.date.getDate() < new Date().getDate()){
          leftovers += day.leftOvers ?? 0;
        }
      })
    })
    month.leftOvers = leftovers;
    /*Algorithm end*/

    this.setMonth(month);
  }
}

enum DB {
  short,
  mid,
  long,
  none
}

