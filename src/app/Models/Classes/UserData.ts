import {Day, Month, SavedData, SavedMonth, Settings, Week} from "../Interfaces";
import {FileEngine} from "../../Services/FileEngine/FileEnigne";
import {IBuchung, IFixkostenEintrag, ISparschweinEintrag, IWunschlistenEintrag} from "../NewInterfaces";

export class UserData {

  public buchungen: IBuchung[] = [];
  public months: Month[] = [];
  public fixkostenEintraege: IFixkostenEintrag[] = [];
  public sparschweinEintraege: ISparschweinEintrag[] = [];
  public wunschlistenEintraege: IWunschlistenEintrag[] = [];
  public settings: Settings;

  private _fileEngine: FileEngine = new FileEngine(true);

  constructor() {
    const savedData: SavedData = this._fileEngine.load();
    this.buchungen = savedData.buchungen;
    this.months = this.convertSavedMonthsToMonths(savedData.savedMonths);
    this.fixkostenEintraege = savedData.fixKosten;
    this.sparschweinEintraege = savedData.sparEintraege;
    this.wunschlistenEintraege = savedData.wunschlistenEintraege;
    this.settings = savedData.settings;
  }

  save() {
    this._fileEngine.save(this.getSavedData());
  }

  getSavedData(): SavedData {
    const savedData: SavedData = {
      buchungen: [],
      savedMonths: [],
      fixKosten: [],
      sparEintraege: [],
      wunschlistenEintraege: [],
      settings: {wunschllistenFilter: {selectedFilter: "", gekaufteEintraegeAusblenden: true}, showDayDifferenceInHome: false}
    }

    savedData.buchungen = this.buchungen;
    savedData.fixKosten = this.fixkostenEintraege;
    savedData.sparEintraege = this.sparschweinEintraege;
    savedData.wunschlistenEintraege = this.wunschlistenEintraege;

    this.months.forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget ?? 0,
        sparen: month.sparen ?? 0,
        fixkosten: month.gesperrteFixKosten
      })
    })

    return savedData;
  }

  private convertSavedMonthsToMonths(savedMonths: SavedMonth[]): Month[] {
    const months: Month[] = [];

    savedMonths.forEach(savedMonth => {
      const date = savedMonth.date;
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
          days.push({ date: dateForDay });
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

      const abgeschlossen = !(this.isDayBeforeMonth(new Date(), startDate) ||
        (startDate.getFullYear() === new Date().getFullYear() && startDate.getMonth() === new Date().getMonth()));

      months.push(
        {
          totalBudget: savedMonth.totalBudget,
          sparen: savedMonth.sparen,
          startDate: startDate,
          endDate: endDate,
          daysInMonth: daysInMonth,
          weeks: weeks,
          monatAbgeschlossen: abgeschlossen
        }
      )
    })

    return months;
  }

  private convertBuchungen() {

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

  private isDayBeforeMonth(dayDate: Date, monthStartDate: Date) {
    if (dayDate.getFullYear() > monthStartDate.getFullYear()) {
      return false;
    }
    if(dayDate.getFullYear() < monthStartDate.getFullYear()) {
      return true
    }
    return dayDate.getMonth() < monthStartDate.getMonth();
  }
}
