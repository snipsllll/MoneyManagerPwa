import {Day, Month, SavedData, SavedMonth, Settings, Week} from "../Interfaces";
import {FileEngine} from "../../Services/FileEngine/FileEnigne";
import {IBuchung, IFixkostenEintrag, ISparschweinEintrag, IWunschlistenEintrag} from "../NewInterfaces";
import {currentDbVersion} from "./CurrentDbVersion";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";

export class UserData {

  public buchungen: IBuchung[] = [];
  public buchungsKategorien: { id: number; name: string }[] = [];
  public months: Month[] = [];
  public standardFixkostenEintraege: IFixkostenEintrag[] = [];
  public sparschweinEintraege: ISparschweinEintrag[] = [];
  public wunschlistenEintraege: IWunschlistenEintrag[] = [];
  public settings: Settings = {
    toHighBuchungenEnabled: false,
    topBarAnzeigeEinstellung: TopBarBudgetOptions.monat,
    wunschlistenFilter: {
      selectedFilter: '',
      gekaufteEintraegeAusblenden: false
    }
  };

  private _fileEngine: FileEngine = new FileEngine(true);

  constructor() {
    this.loadDataFromStorage();
  }

  addKategorie(name: string): void {
    const newId = this.buchungsKategorien.length
      ? Math.max(...this.buchungsKategorien.map(k => k.id)) + 1
      : 1; // Neue ID generieren
    this.buchungsKategorien.push({ id: newId, name });
    this.save();
  }

  // Entfernt eine Kategorie anhand ihrer ID
  removeKategorie(id: number): void {
    this.buchungsKategorien = this.buchungsKategorien.filter(k => k.id !== id);
    this.save();
  }

  // Bearbeitet eine bestehende Kategorie
  editKategorie(id: number, newName: string): void {
    const kategorie = this.buchungsKategorien.find(k => k.id === id);
    if (kategorie) {
      kategorie.name = newName;
    }
    this.save();
  }

  // Gibt alle Kategorienamen als Array von Strings zurück
  getKategorienNamen(): string[] {
    return this.buchungsKategorien.map(k => k.name);
  }

  loadDataFromStorage() {
    let loadedData: any = this._fileEngine.load();
    let savedData: SavedData = this.checkForDbUpdates(loadedData);

    this.buchungen = savedData.buchungen ?? [];
    this.buchungsKategorien = savedData.buchungsKategorien ?? [];
    this.months = this.convertSavedMonthsToMonths(savedData.savedMonths ?? []);
    this.standardFixkostenEintraege = savedData.standardFixkostenEintraege ?? [];
    this.sparschweinEintraege = savedData.sparEintraege ?? [];
    this.wunschlistenEintraege = savedData.wunschlistenEintraege ?? [];
    this.settings = savedData.settings ?? this.getDefaultSettings();
  }

  save(savedData?: SavedData) {
    if (savedData) {
      this._fileEngine.save(this.checkForDbUpdates(savedData));
      this.reload();
    } else {
      this._fileEngine.save(this.getSavedData());
    }
  }

  private checkForDbUpdates(data: any): SavedData {
    let currentData: any;

    data.dbVersion  //wenn keine dbVersion gespeichert wurde, wird sie auf 0 gesetzt
      ? currentData = data
      : currentData = {dbVersion: 0, ...data};

    if (currentData.dbVersion < 1) {
      currentData = this.convertToVersion1(currentData);
    }

    if(currentData.dbVersion < 2) {
      currentData = this.convertFixkostenToStandardFixkosten(currentData);
    }

    if(currentData.dbVersion < 3) {
      currentData = this.addEmptyKategorieZuAllenBuchungen(currentData);
    }

    currentData.dbVersion = currentDbVersion;
    return currentData as SavedData;
  }

  private addEmptyKategorieZuAllenBuchungen(data: any) {
    console.log(data.buchungen)
    let buchungen = data.buchungen.map((buchung: any) => ({
      id: buchung.id,
      data: {
        date: buchung.data.date,
        beschreibung: buchung.data.beschreibung,
        betrag: buchung.data.betrag,
        title: buchung.data.title,
        time: buchung.data.time,
        buchungsKategorie: undefined
      }
    }))

    const { buchungen: _, ...rest } = data;

    return {
      buchungen: buchungen,
      dbVersion: 3,
      ...rest
    };
  }

  private convertFixkostenToStandardFixkosten(data: any) {
    let standardFixkosten = data.fixKosten.map((fixkosteneintrag: any) => ({
      id: fixkosteneintrag.id,
      data: {
        betrag: fixkosteneintrag.data.betrag,
        title: fixkosteneintrag.data.title,
        zusatz: fixkosteneintrag.data.zusatz
      }
    }));

    let savedMonths = data.savedMonths.map((month: any) => ({
      date: month.date,
      totalBudget: month.totalBudget,
      sparen: month.sparen,
      uebernommeneStandardFixkostenEintraege: month.fixkosten.map((fixkosteneintrag: any) => ({
        id: fixkosteneintrag.id,
        data: {
          betrag: fixkosteneintrag.betrag,
          title: fixkosteneintrag.title,
          zusatz: fixkosteneintrag.zusatz,
          isExcluded: false,
          isStandardFixkostenEintrag: true
        }
      })) ?? [],
      specialFixkostenEintraege: []
    }));

    let settings = {
      topBarAnzeigeEinstellung: TopBarBudgetOptions.monat,
      tagesAnzeigeOption: TagesAnzeigeOptions.Tagesausgaben,
      ...data.settings
    }

    const { savedMonths: _, fixKosten: __, settings: ___,  ...rest } = data;

    return {
      savedMonths,
      standardFixkosten,
      settings,
      dbVersion: 2,
      ...rest
    };
  }

  private convertToVersion1(datax: any): any {
    // Umwandlung der Buchungen
    let buchungen = datax.buchungen.map((buchung: any) => ({
      id: buchung.id,
      data: {
        date: buchung.date,
        beschreibung: buchung.beschreibung,
        betrag: buchung.betrag,
        title: buchung.title,
        time: buchung.time
      }
    }));

    // Umwandlung der fixKosten
    let fixkosten = datax.fixKosten.map((fixkosteneintrag: any) => ({
      id: fixkosteneintrag.id,
      data: {
        betrag: fixkosteneintrag.betrag,
        title: fixkosteneintrag.title,
        zusatz: fixkosteneintrag.zusatz
      }
    }));

    // Umwandlung der savedMonths
    let savedMonths = datax.savedMonths.map((month: any) => ({
      date: month.date,
      totalBudget: month.totalBudget,
      sparen: month.sparen,
      fixkosten: month.fixkosten.map((fixkosteneintrag: any) => ({
        id: fixkosteneintrag.id,
        data: {
          betrag: fixkosteneintrag.betrag,
          title: fixkosteneintrag.title,
          zusatz: fixkosteneintrag.zusatz
        }
      }))
    }));

    interface SparEintragV0 {
      id: number;
      data: {
        betrag: number;
        title: string;
        beschreibung: string;
        date: Date;
        vonMonat: boolean;
      }
    }

    // Umwandlung der sparEintraege
    let sparEintraege: SparEintragV0[] = datax.sparEintraege.map((sparEintrag: any) => ({
      id: sparEintrag.id,
      data: {
        betrag: sparEintrag.betrag,
        title: sparEintrag.title,
        zusatz: sparEintrag.zusatz,
        date: sparEintrag.date,
        vonMonat: sparEintrag.isMonatEintrag
      }
    }));

    sparEintraege = sparEintraege.filter(eintrag => eintrag.data.vonMonat !== true)

    // Umwandlung der wunschlistenEintraege
    let wunschlistenEintraege = datax.wunschlistenEintraege.map((wunschlisteEintrag: any) => ({
      id: wunschlisteEintrag.id,
      data: {
        betrag: wunschlisteEintrag.betrag,
        title: wunschlisteEintrag.title,
        zusatz: wunschlisteEintrag.zusatz,
        gekauft: wunschlisteEintrag.gekauft,
        date: wunschlisteEintrag.date,
        erstelltAm: wunschlisteEintrag.erstelltAm
      }
    }));

    // Die restlichen Eigenschaften extrahieren, ohne die umgewandelten Daten
    const { buchungen: _, fixKosten: __, sparEintraege: ___, wunschlistenEintraege: ____ , ...rest } = datax;

    // Die finale umgewandelte Struktur
    return {
      buchungen,
      savedMonths,
      fixKosten: fixkosten,
      sparEintraege,
      wunschlistenEintraege,
      settings: {
        toHighBuchungenEnabled: true,
        showDaySpend: true,
        wunschllistenFilter: datax.settings.wunschllistenFilter
      },
      dbVersion: 1,
      ...rest
    };
  }

  private reload() {
    let loadedData: any = this._fileEngine.load();

    let savedData: SavedData = this.checkForDbUpdates(loadedData);

    this.buchungen = savedData.buchungen;
    this.months = this.convertSavedMonthsToMonths(savedData.savedMonths);
    this.standardFixkostenEintraege = savedData.standardFixkostenEintraege;
    this.sparschweinEintraege = savedData.sparEintraege;
    this.wunschlistenEintraege = savedData.wunschlistenEintraege;
    this.settings = savedData.settings;
  }

  deleteAllData() {
    this._fileEngine.save({
      buchungen: [],
      buchungsKategorien: [],
      settings: {
        toHighBuchungenEnabled: true,
        wunschlistenFilter: {
          selectedFilter: '',
          gekaufteEintraegeAusblenden: false
        },
        tagesAnzeigeOption: TagesAnzeigeOptions.leer,
        topBarAnzeigeEinstellung: TopBarBudgetOptions.leer
      },
      wunschlistenEintraege: [],
      sparEintraege: [],
      standardFixkostenEintraege: [],
      savedMonths: [],
      dbVersion: currentDbVersion
    });
    this.reload();
  }

  getSavedData(): SavedData {
    const savedData: SavedData = {
      buchungen: [],
      buchungsKategorien: [],
      savedMonths: [],
      standardFixkostenEintraege: [],
      sparEintraege: [],
      wunschlistenEintraege: [],
      settings: {
        wunschlistenFilter: {selectedFilter: "", gekaufteEintraegeAusblenden: true},
        toHighBuchungenEnabled: false
      },
      dbVersion: currentDbVersion
    }

    savedData.buchungen = this.buchungen;
    savedData.buchungsKategorien = this.buchungsKategorien;
    savedData.standardFixkostenEintraege = this.standardFixkostenEintraege;
    savedData.sparEintraege = this.sparschweinEintraege;
    savedData.wunschlistenEintraege = this.wunschlistenEintraege;
    savedData.settings = this.settings;

    this.months.forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget ?? 0,
        sparen: month.sparen ?? 0,
        uebernommeneStandardFixkostenEintraege: month.uebernommeneStandardFixkostenEintraege,
        specialFixkostenEintraege: month.specialFixkostenEintraege
      })
    })

    return savedData;
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
          specialFixkostenEintraege: savedMonth.specialFixkostenEintraege ?? []
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
}
