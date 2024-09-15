import {Injectable, signal} from '@angular/core';
import {UserData} from "../../Models/Classes/UserData";
import {FileEngine} from "../FileEngine/FileEnigne";
import {
  Buchung,
  BudgetInfosForMonth,
  Day,
  DayIstBudgets,
  FixKostenEintrag,
  Month,
  SavedData,
  Settings,
  SparschweinEintrag,
  UpdateValues,
  Week,
  WunschlistenEintrag
} from "../../Models/Interfaces";
import {DB} from "../../Models/Enums";

@Injectable({
  providedIn: 'root'
})

export class DataService {

  userData!: UserData;
  settings!: Settings;
  testData: DB = DB.noTD;
  download: boolean = true;

  updated = signal<number>(0);

  private _fileEngine = new FileEngine(this.testData, this.download);

  constructor() {
    this.initializeData();
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
    fixkostenEintrag.id = this.getNextFreeFixKostenId();
    this.update({
      newFixkostenEintraege: [fixkostenEintrag]
    })
  }

  editFixKostenEintrag(fixkostenEintrag: FixKostenEintrag) {
    this.update({
      editedFixkostenEintraege: [fixkostenEintrag]
    })
  }

  deleteFixKostenEintrag(fixkostenEintragsId: number) {
    this.update({
      deletedFixkostenEintreageIds: [fixkostenEintragsId]
    })
  }

  setFixKostenEintragForMonth(date: Date, fixkostenEintraege?: FixKostenEintrag[]) {
    const month = this.getMonthByDate(date);

    month.gesperrteFixKosten = fixkostenEintraege;

    this.setMonth(month);
  }

  addWunschlistenEintrag(wunschlistenEintrag: WunschlistenEintrag) {
    wunschlistenEintrag.id = this.getNextFreeWunschlistenEintragId();
    this.update({
      newWunschlistenEintraege: [wunschlistenEintrag]
    })
  }

  editWunschlistenEintrag(wunschlistenEintrag: WunschlistenEintrag) {
    this.update({
      editedWunschlistenEintraege: [wunschlistenEintrag]
    })
  }

  deleteWunschlistenEintrag(wunschlistenEintragsId: number) {
    this.update({
      deletedWunschlistenEintragIds: [wunschlistenEintragsId]
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
    //Wenn für den 'heutigen Tag (new Date())' noch kein Monat vorhanden ist, dann erstelle einen neuenn monat für den 'heutigen Tag'
    if (!this.checkIfMonthExistsForDay(new Date())) {
      this.createNewMonth(new Date());
    }

    if (updateValues) {
      //Wenn neue Fixkosteneinträge vorhanden, dann zu userData.fixKosten hinzufügen
      if (updateValues.newFixkostenEintraege !== undefined) {
        updateValues.newFixkostenEintraege.forEach(fixKostenEintrag => {
          this.userData.fixKosten.push(fixKostenEintrag);
        })
      }

      //Wenn FixkostenEinträge gelöscht wurden, dann aus userData.fixKosten entfernen
      if (updateValues.deletedFixkostenEintreageIds !== undefined) {
        updateValues.deletedFixkostenEintreageIds.forEach(fixKostenEintragsId => {
          this.userData.fixKosten.splice(this.getFixKostenIndex(fixKostenEintragsId!), 1);
        })
      }

      //Wenn Fixkosteneinträge verändert wurden, dann in userData.fixKosten anpassen
      if (updateValues.editedFixkostenEintraege !== undefined) {
        updateValues.editedFixkostenEintraege.forEach(fixKostenEintrag => {
          this.userData.fixKosten[this.getFixKostenIndex(fixKostenEintrag.id!)] = fixKostenEintrag;
        })
      }

      //Wenn neue Buchungen angelegt wurden, dann neue Buchungen zu userData.buchungen.allebuchungen hinzufügen
      if (updateValues.newBuchungen !== undefined) {
        updateValues.newBuchungen.forEach(buchung => {
          this.userData.buchungen.alleBuchungen.push(buchung);
          if (!this.checkIfMonthExistsForDay(buchung.date)) {
            this.createNewMonth(buchung.date);
          }
        })
      }

      //Wenn Buchungen gelöscht wurden, dann Buchungen aus userData.buchungen.alleBuchungen entfernen
      if (updateValues.deletedBuchungsIds !== undefined) {
        updateValues.deletedBuchungsIds.forEach(buchungsId => {
          this.userData.buchungen.alleBuchungen.splice(this.getIndexOfBuchungById(buchungsId), 1);
        })
      }

      //Wenns bearbeitete Buchungen gibt, dann Buchungen in userData.buchungen.alleBuchungen anpassen
      if (updateValues.editedBuchungen !== undefined) {
        updateValues.editedBuchungen.forEach(buchung => {
          this.userData.buchungen.alleBuchungen[this.getIndexOfBuchungById(buchung.id)] = buchung;
          if (!this.checkIfMonthExistsForDay(buchung.date)) {
            this.createNewMonth(buchung.date);
          }
        })
      }

      //Wenn neue Spareinträge angelegt wurden, dann neue Spareinträge zu userData.spareintraege hinzufügen
      if (updateValues.newSparEintraege !== undefined) {
        updateValues.newSparEintraege.forEach(eintrag => {
          this.userData.sparEintraege.push(eintrag);
        })
      }

      //Wenn Spareintraege gelöscht wurden, dann Spareinträge aus userData.spareintraege entfernen
      if (updateValues.deletedSparEintragIds !== undefined) {
        updateValues.deletedSparEintragIds.forEach(eintragId => {
          this.userData.sparEintraege.splice(this.getIndexOfSpareintragById(eintragId), 1);
        })
      }

      //Wenns bearbeitete Spareinträge gibt, dann Spareinträge in userData.spareintraege anpassen
      if (updateValues.editedSparEintraege !== undefined) {
        updateValues.editedSparEintraege.forEach(eintrag => {
          this.userData.sparEintraege[this.getIndexOfSpareintragById(eintrag.id)] = eintrag;
        })
      }

      //Wenn neue Wunschlisteneinträge angelegt wurden, dann neue Wunschlisteneinträge zu userData.wunschlisteneintraege hinzufügen
      if (updateValues.newWunschlistenEintraege !== undefined) {
        updateValues.newWunschlistenEintraege.forEach(eintrag => {
          this.userData.wunschlistenEintraege.push(eintrag);
        })
      }

      //Wenn Wunschlisteneinträge gelöscht wurden, dann Wunschlisteneinträge aus userData.wunschlisteneintraege entfernen
      if (updateValues.deletedWunschlistenEintragIds !== undefined) {
        updateValues.deletedWunschlistenEintragIds.forEach(eintragId => {
          this.userData.wunschlistenEintraege.splice(this.getIndexOfWunschlistenEintragById(eintragId), 1);
        })
      }

      //Wenns bearbeitete Wunschlisteneinträge gibt, dann Wunschlisteneinträge in userData.wunschlisteneintraege anpassen
      if (updateValues.editedWunschlistenEintraege !== undefined) {
        updateValues.editedWunschlistenEintraege.forEach(eintrag => {
          this.userData.wunschlistenEintraege[this.getIndexOfWunschlistenEintragById(eintrag.id!)] = eintrag;
        })
      }

      if (updateValues.months) {
        updateValues.months.forEach(month => {
          if (!this.checkIfMonthExistsForDay(month.date)) {
            this.createNewMonth(month.date);
          }

          //Wenn für einen abgeschlossenen Monat neue Fixkosten eingetragen wurden
          if (month.newFixkostenEintraege !== undefined) {
            if (this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten === undefined) {
              this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten = [];
            }
            month.newFixkostenEintraege.forEach(eintrag => {
              this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten!.push(eintrag);
            })
          }

          //Wenn für einen abgeschlossenen Monat Fixkosten verändert wurden
          if (month.newFixkostenEintraege !== undefined) {
            month.newFixkostenEintraege.forEach(eintrag => {
              this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten![this.getFixKostenEintragIndex(eintrag, month.date)] = eintrag;
            })
          }

          //Wenn für einen abgeschlossenen Monat Fixkosten gelöscht wurden
          if (month.newFixkostenEintraege !== undefined) {
            if (this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten === undefined) {
              this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten = [];
            }
            month.newFixkostenEintraege.forEach(eintrag => {
              this.userData.months()[this.getIndexOfMonth(month.date)].gesperrteFixKosten!.splice(this.getFixKostenEintragIndex(eintrag, month.date), 1);
            })
          }

          //Wenn sparen geändert wurde
          if (month.newSparen !== undefined) {
            this.userData.months()[this.getIndexOfMonth(month.date)].sparen = month.newSparen;
          }

          //Wenn totalBudget geändert wurde
          if (month.newTotalBudget !== undefined) {
            this.userData.months()[this.getIndexOfMonth(month.date)].totalBudget = month.newTotalBudget;
          }

          //Wenn maxDayBudget geändert wurde
          if (month.newMaxDayBudget !== undefined) {
            //TODO
          }
        })
      }
    }

    /*Weird and crazy stuff beginns here*/
    this.updateAllBuchungen();

    this.userData.months().forEach(month => {
      //Buchungen in Monat zu den jeweiligen Tagen hinzufügen/updaten
      this.updateBuchungenForMonth(month.startDate);

      this.updateFixKostenForMonth(month.startDate);

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

      this.calcSpareintragForMonth(month.startDate);
    });
    if (safeAfterUpdate === undefined || safeAfterUpdate === true) {
      this.save();
    }
    this.sendUpdateToComponents();
  }

  getDayIstBudgets(date: Date): DayIstBudgets {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return {
        dayIstBudget: undefined,
        weekIstBudget: undefined,
        monthIstBudget: undefined,
        leftOvers: undefined,
        gespartes: undefined
      }
    }
    const month = this.userData.months()[monthIndex];

    const weekIndex = this.getIndexOfWeekInMonth(date);
    if (weekIndex === -1) {
      return {
        dayIstBudget: undefined,
        weekIstBudget: undefined,
        monthIstBudget: undefined,
        leftOvers: undefined,
        gespartes: undefined
      }
    }
    const week = this.userData.months()[monthIndex].weeks![this.getIndexOfWeekInMonth(date)];

    const dayIndex = this.getIndexOfDayInWeek(date);
    if (dayIndex === -1) {
      return {
        dayIstBudget: undefined,
        weekIstBudget: undefined,
        monthIstBudget: undefined,
        leftOvers: undefined,
        gespartes: undefined
      }
    }
    const day = this.userData.months()[monthIndex].weeks![weekIndex].days![dayIndex];
    const gespartes = this.getGespartes();

    return {
      dayIstBudget: day.istBudget ?? undefined,
      weekIstBudget: week.istBudget ?? undefined,
      monthIstBudget: month.istBudget ?? undefined,
      leftOvers: month.leftOvers ?? undefined,
      gespartes: gespartes
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
      fixKostenSumme: this.getFixKostenSummeForMonth(month),
      fixKostenGesperrt: month.monatAbgeschlossen ?? false,
      fixKostenEintraege: month.monatAbgeschlossen ? month.gesperrteFixKosten : this.userData.fixKosten
    }
  }

  getBuchungById(buchungsId: number) {
    return this.userData.buchungen.alleBuchungen.find(buchung => buchung.id === buchungsId);
  }

  getFixKostenSummeForMonth(month: Month) {
    let summe = 0;
    if (month.monatAbgeschlossen) {
      if (month.gesperrteFixKosten) {
        month.gesperrteFixKosten.forEach(eintrag => {
          summe += eintrag.betrag;
        })
      }
    } else {
      if (this.userData.fixKosten === undefined) {
        this.userData.fixKosten = [];
      }
      this.userData.fixKosten.forEach(eintrag => {
        summe += eintrag.betrag;
      })
    }
    return summe;
  }

  getSparEintraege() {
    return this.userData.sparEintraege.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  addSparEintrag(eintrag: SparschweinEintrag) {
    eintrag.id = this.getNextFreeSparEintragId();
    this.update({
      newSparEintraege: [
        eintrag
      ]
    });
  }

  editSparEintrag(eintrag: SparschweinEintrag) {
    this.update({
      editedSparEintraege: [
        eintrag
      ]
    });
  }

  deleteSparEintrag(eintragId: number) {
    this.update({
      deletedSparEintragIds: [
        eintragId
      ]
    });
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

  checkIfMonthExistsForDay(date: Date): boolean {
    return this.userData.months().findIndex(month => month.startDate.getMonth() === date.getMonth() && month.startDate.getFullYear() === date.getFullYear()) !== -1;
  }

  getSavedData(): SavedData {
    const savedData: SavedData = {
      buchungen: [],
      savedMonths: [],
      fixKosten: [],
      sparEintraege: [],
      wunschlistenEintraege: [],
      settings: undefined
    }

    savedData.buchungen = this.userData.buchungen.alleBuchungen;
    savedData.fixKosten = this.userData.fixKosten;
    savedData.sparEintraege = this.userData.sparEintraege;
    savedData.wunschlistenEintraege = this.userData.wunschlistenEintraege;
    savedData.settings = this.settings;

    this.userData.months().forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget ?? 0,
        sparen: month.sparen ?? 0,
        fixkosten: month.gesperrteFixKosten
      })
    })

    return savedData;
  }

  private initializeData() {
    const savedData = this._fileEngine.load();

    //Converting SavedData to UserData
    this.userData = new UserData();
    this.userData.buchungen.alleBuchungen = savedData.buchungen ?? [];
    this.userData.fixKosten = savedData.fixKosten ?? [];
    this.userData.sparEintraege = savedData.sparEintraege ?? [];
    this.userData.wunschlistenEintraege = savedData.wunschlistenEintraege ?? [];

    savedData.savedMonths?.forEach(month => {
      if (!this.checkIfMonthExistsForDay(month.date)) {
        this.createNewMonth(month.date);
      }
      this.changeSparenForMonth(month.date, month.sparen, false);
      this.changeTotalBudgetForMonth(month.date, month.totalBudget, false);
      this.setFixKostenEintragForMonth(month.date, month.fixkosten);
    });

    this.settings = savedData.settings ?? {
      wunschllistenFilter: {
        gekaufteEintraegeAusblenden: false,
        selectedFilter: ''
      }
    };

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
    if (month.budget === undefined) {
      return;
    }
    month.istBudget = +(month.budget - this.getAusgabenSummeForMonth(date));
    /*Algorithm end*/

    this.setMonth(month);
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

  private calcIstBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        let plannedAusgaben = 0;
        day.buchungen?.forEach(buchung => {
          if(!buchung.apz){
            plannedAusgaben += buchung.betrag!
          }
        })
        day.istBudget = +(day.budget! - plannedAusgaben);
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

  private calcBudgetsForAllDaysInMonth(date: Date) { //TODO testen
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    if (month.dailyBudget === undefined) {
      return;
    }

    let daysLeft: number = month.daysInMonth!;
    let apzSumme = 0;
    let apzSummeForDay = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => {
          if(buchung.apz) {
            apzSumme += buchung.betrag ?? 0;
            apzSummeForDay = +(apzSumme / daysLeft);
          }
        })

        day.budget = +(month.dailyBudget! - apzSummeForDay);
        daysLeft--;
      })
    })
    /*Algorithm end*/

    this.setMonth(month)
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

    month.dailyBudget = +((month.totalBudget - (month.sparen ?? 0) - (this.getFixKostenSummeForMonth(month) ?? 0)) / month.daysInMonth);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private updateAllBuchungen() {
    this.userData.sparEintraege.forEach(eintrag => {
      if(eintrag.vonDayBudgetAbziehen === true && this.userData.buchungen.alleBuchungen.find(buchung => buchung.speId === eintrag.id) === undefined) {
        this.userData.buchungen.alleBuchungen.push({
          date: eintrag.date,
          betrag: eintrag.betrag,
          id: this.getNextFreeBuchungsId(),
          title: eintrag.title ?? '',
          beschreibung: 'Spar-Eintrag',
          time: eintrag.date.toLocaleTimeString(),
          spe: true,
          speId: eintrag.id
        })
      }
    })

    const alleBuchungen: Buchung[] = [];
      this.userData.buchungen.alleBuchungen.forEach(buchung => {
        let addBuchung = true;
        if(buchung.spe) {
          if(this.userData.sparEintraege.find(eintrag => eintrag.id === buchung.speId) === undefined){
            addBuchung = false;
          }
        }

        if(addBuchung) {
          alleBuchungen.push(buchung);
        }
      })

      this.userData.buchungen.alleBuchungen = alleBuchungen;

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

    while (weekStartDate.getDate() <= endDate.getDate() && weekStartDate.getMonth() <= endDate.getMonth()) {
      let weekEndDate: Date = this.getSunday(weekStartDate);

      if (weekEndDate.getMonth() > endDate.getMonth()) {
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

    month.monatAbgeschlossen = !(this.isDayBeforeMonth(new Date(), month) || (month.startDate.getFullYear() === new Date().getFullYear() && month.startDate.getMonth() === new Date().getMonth()));

    this.userData.months().push(month);
  }

  save(savedData?: SavedData) { //TODO testen
    if(savedData !== undefined) {
      this._fileEngine.save(savedData);
      this.initializeData();
    } else {
      this._fileEngine.save(this.getSavedData());
    }
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

  getMonthByDate(date: Date) {
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

    if (month.daysInMonth === undefined || month.totalBudget === undefined || month.dailyBudget === undefined) {
      return;
    }

    /*Algorithm start*/
    month.budget = +(month.totalBudget - (month.sparen ?? 0) - (this.getFixKostenSummeForMonth(month) ?? 0));
    /*Algorithm end*/

    this.setMonth(month);
  }

  private calcLeftOversForAllDaysInMonth(date: Date) {
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.leftOvers = (day.budget ?? 0) - this.getPlannedAusgabenForDay(day);
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
        if (day.date.getDate() < new Date().getDate()) {
          leftovers += day.leftOvers ?? 0;
        }
      })
      week.leftOvers = +(leftovers);
    })
    /*Algorithm end*/

    this.setMonth(month);
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

  private calcLeftOversForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    /*Algorithm start*/
    let leftovers = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if ((day.date.getDate() < new Date().getDate() && day.date.getMonth() === new Date().getMonth()) || (day.date.getMonth() < new Date().getMonth() && day.date.getFullYear() <= new Date().getFullYear())) {
          leftovers += day.leftOvers ?? 0;
        }
      })
    })
    month.leftOvers = +(leftovers);
    /*Algorithm end*/

    this.setMonth(month);
  }

  private getGespartes() {
    let gespartes = 0;
    this.userData.sparEintraege.forEach(eintrag => {
      gespartes += eintrag.betrag;
    })
    return gespartes;
  }

  private getAusgabenForDay(day: Day) {
    let gesAusgaben = 0;
    day.buchungen?.forEach(buchung => {
      gesAusgaben += buchung.betrag!;
    })
    return gesAusgaben;
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

  private getFixKostenEintragIndex(pEintrag: FixKostenEintrag, monthDate?: Date) {
    if (monthDate) {
      if (this.userData.months()[this.getIndexOfMonth(monthDate)].gesperrteFixKosten === undefined) {
        return -1;
      }
      return this.userData.months()[this.getIndexOfMonth(monthDate)].gesperrteFixKosten!.findIndex(eintrag => eintrag.id === pEintrag.id);
    }

    return this.userData.fixKosten.findIndex(eintrag => eintrag.id === pEintrag.id);
  }

  private updateFixKostenForMonth(startDate: Date) {
    const month = this.getMonthByDate(startDate);
    if (!month.monatAbgeschlossen) {
      month.gesperrteFixKosten = this.userData.fixKosten;
    }
  }

  private calcSpareintragForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    if (month.startDate.getMonth() < new Date().getMonth() || month.startDate.getFullYear() < new Date().getFullYear()) {
      if (this.isMonthSpareintragVorhanden(date)) {
        this.userData.sparEintraege[this.getIndexOfMonthSpareintrag(date)] = {
          date: month.startDate,
          betrag: (month.leftOvers ?? 0) + (month.sparen ?? 0),
          id: this.userData.sparEintraege[this.getIndexOfMonthSpareintrag(date)].id,
          isMonatEintrag: true
        }
      } else {
        this.userData.sparEintraege.push({
          date: month.startDate,
          betrag: (month.leftOvers ?? 0) + (month.sparen ?? 0),
          id: this.getNextFreeSparEintragId(),
          isMonatEintrag: true
        })
      }
    }
  }

  private getIndexOfMonthSpareintrag(date: Date) {
    return this.userData.sparEintraege.findIndex(eintrag => eintrag.isMonatEintrag && eintrag.date.toLocaleDateString() === date.toLocaleDateString());
  }

  private getNextFreeSparEintragId() {
    let freeId = 1;
    for (let i = 0; i < this.userData.sparEintraege.length; i++) {
      if (this.userData.sparEintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getNextFreeWunschlistenEintragId() {
    let freeId = 1;
    for (let i = 0; i < this.userData.wunschlistenEintraege.length; i++) {
      if (this.userData.wunschlistenEintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private isMonthSpareintragVorhanden(date: Date) {
    return !(this.userData.sparEintraege.find(eintrag => eintrag.date.toLocaleDateString() === date.toLocaleDateString()) == undefined)
  }

  getErspartes() {
    let eintraege = this.userData.sparEintraege;
    let allEintraege: SparschweinEintrag[] = [];

    this.userData.wunschlistenEintraege.forEach(wEintrag => {
      if(wEintrag.gekauft === true) {
        const x: SparschweinEintrag = {
          betrag: wEintrag.betrag * -1,
          date: wEintrag.date,
          id: -1,
          zusatz: wEintrag.zusatz,
          title: wEintrag.title
        }
        allEintraege.push(x);
      }
    })

    eintraege.forEach(eintrag => {
      allEintraege.push(eintrag);
    })
    let erspartes = 0;
    allEintraege.forEach(eintrag => {
      erspartes += eintrag.betrag;
    })
    return +(erspartes);
  }

  private getIndexOfSpareintragById(eintragId: number) {
    return this.userData.sparEintraege.findIndex(eintrag => eintrag.id === eintragId);
  }

  private getIndexOfWunschlistenEintragById(eintragId: number) {
    return this.userData.wunschlistenEintraege.findIndex(eintrag => eintrag.id === eintragId);
  }
}
