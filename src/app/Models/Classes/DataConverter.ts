import {IUserData} from "../NewInterfaces";
import {Day, Month, SavedMonth, Settings, Week} from "../Interfaces";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";
import {UT} from "./UT";

export class DataConverter {

  private utils: UT = new UT();

  convertFireDataToSavedData(data: any): any {
    console.log("...converting fireData into savedData");
    if (!this.isInputDataValid(data))
      return;

    let convertedSavedData = this.convertFireDataToSavedDataRekursive(data);

    console.log("Successfully converted fireData into savedData");
    return convertedSavedData;
  }

  convertSavedDataToUserData(data: any): IUserData {
    console.log("...converting savedData into userData");

    if (!this.isInputDataValid(data)) {
      throw new Error("Provided data was null or undefined!")
    }

    let userData: IUserData = this.utils.getEmptyUserData();

    userData.buchungen = data.buchungen ?? [];
    userData.buchungsKategorien = data.buchungsKategorien ?? [];
    userData.months = this.convertSavedMonthsToMonths(data.savedMonths ?? []);
    userData.sparschweinEintraege = data.sparEintraege ?? [];
    userData.wunschlistenEintraege = data.wunschlistenEintraege ?? [];
    userData.auswertungsLayouts = data.auswertungsLayouts ?? [];
    userData.settings = data.settings ?? this.getDefaultSettings();
    userData.geplanteAusgabenBuchungen = data.geplanteAusgabenBuchungen ?? [];
    userData.standardFixkostenEintraege = data.standardFixkostenEintraege ?? [];

    console.log("Successfully converted savedData into userData");
    return userData;
  }

  convertUserDataToSavedData(data: any): any {
    console.log("...converting userData into savedData");

    if (!this.isInputDataValid(data))
      return;


    console.log("Successfully converted userData into savedData");

  }

  convertSavedDataToFireData(data: any): any {
    console.log("...converting savedData into fireData");

    if (!this.isInputDataValid(data))
      return;

    let convertedFireData = this.convertSavedDataToFireDataRekursive(data);

    console.log("Successfully converted savedData into fireData");
    return convertedFireData;

  }

  private convertSavedDataToFireDataRekursive(input: any): any {
    if (input === null || input === undefined) {
      return input;
    }

    if (input instanceof Date) {
      return {milliseconds: 0, seconds: Math.floor(new Date(input).getTime() / 1000)};
    }

    if (Array.isArray(input)) {
      return input.map(item => this.convertSavedDataToFireDataRekursive(item));
    }

    if (typeof input === 'object') {
      const transformedObject: any = {};
      for (const key of Object.keys(input)) {
        transformedObject[key] = this.convertSavedDataToFireDataRekursive(input[key]);
      }
      return transformedObject;
    }

    // Return primitive values as they are
    return input;
  }

  private convertFireDataToSavedDataRekursive(input: any): any {
    if (input === null || input === undefined) {
      return input;
    }

    // Konvertiere {milliseconds, seconds} zu einem Date-Objekt
    if (typeof input === 'object' && 'seconds' in input) {
      return new Date(input.seconds * 1000);
    }

    if (Array.isArray(input)) {
      return input.map(item => this.convertFireDataToSavedDataRekursive(item));
    }

    if (typeof input === 'object') {
      const transformedObject: any = {};
      for (const key of Object.keys(input)) {
        transformedObject[key] = this.convertFireDataToSavedDataRekursive(input[key]);
      }
      return transformedObject;
    }

    // Gib primitive Werte unverändert zurück
    return input;
  }

  private isInputDataValid(inputData: any): boolean {
    if (inputData === null) {
      console.error("inputData is null!");
      return false;
    }

    if (inputData === undefined) {
      console.error("inputData is undefined!");
      return false;
    }

    return true;
  }

  private convertSavedMonthsToMonths(savedMonths: SavedMonth[]): Month[] {
    const months: Month[] = [];

    savedMonths.forEach(savedMonth => {
      const date = new Date(savedMonth.date);
      const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
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
          monatAbgeschlossen: abgeschlossen,
          uebernommeneStandardFixkostenEintraege: savedMonth.uebernommeneStandardFixkostenEintraege ?? [],
          specialFixkostenEintraege: savedMonth.specialFixkostenEintraege ?? [],
          geplanteAusgaben: savedMonth.geplanteAusgaben ?? []
        }
      )
    })

    return months;
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
    if (dayDate.getFullYear() < monthStartDate.getFullYear()) {
      return true
    }
    return dayDate.getMonth() < monthStartDate.getMonth();
  }

  private getDefaultSettings(): Settings {
    return {
      toHighBuchungenEnabled: true,
      wunschlistenFilter: {
        selectedFilter: '',
        gekaufteEintraegeAusblenden: false
      },
      tagesAnzeigeOption: TagesAnzeigeOptions.leer,
      topBarAnzeigeEinstellung: TopBarBudgetOptions.leer
    };
  }
}
