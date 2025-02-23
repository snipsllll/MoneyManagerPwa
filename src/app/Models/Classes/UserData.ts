import {
  Day,
  FireData,
  FireMonth, IFireGeplanteAusgabenBuchung, IGeplanteAusgabe,
  IGeplanteAusgabenBuchung,
  Month,
  SavedData,
  SavedMonth,
  Settings,
  Week
} from "../Interfaces";
import {
  IBuchung,
  IFireBuchung,
  IFireSparschweinEintrag,
  IFixkostenEintrag, IGeplanteAusgabenKategorie,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "../NewInterfaces";
import {currentDbVersion} from "./CurrentDbVersion";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";
import {IAuswertungsLayout} from "../Auswertungen-Interfaces";

export class UserData {

  private useEmptyData = false;

  public buchungen: IBuchung[] = [];
  public buchungsKategorien: { id: number; name: string }[] = [];
  public months: Month[] = [];
  public standardFixkostenEintraege: IFixkostenEintrag[] = [];
  public sparschweinEintraege: ISparschweinEintrag[] = [];
  public wunschlistenEintraege: IWunschlistenEintrag[] = [];
  public auswertungsLayouts: IAuswertungsLayout[] = [];
  public geplanteAusgabenBuchungen: IGeplanteAusgabenBuchung[] = [];
  public settings: Settings = {
    toHighBuchungenEnabled: false,
    topBarAnzeigeEinstellung: TopBarBudgetOptions.monat,
    wunschlistenFilter: {
      selectedFilter: '',
      gekaufteEintraegeAusblenden: false
    }
  };

  constructor() {

  }

  transformToFireData(input: any): any {
    if (input === null || input === undefined) {
      return input;
    }

    if (input instanceof Date) {
      return {milliseconds: 0, seconds: Math.floor(new Date(input).getTime() / 1000)};
    }

    if (Array.isArray(input)) {
      return input.map(item => this.transformToFireData(item));
    }

    if (typeof input === 'object') {
      const transformedObject: any = {};
      for (const key of Object.keys(input)) {
        transformedObject[key] = this.transformToFireData(input[key]);
      }
      return transformedObject;
    }

    // Return primitive values as they are
    return input;
  }

  transformToSavedData(input: any): any {
    if (input === null || input === undefined) {
      return input;
    }

    // Konvertiere {milliseconds, seconds} zu einem Date-Objekt
    if (typeof input === 'object' && 'seconds' in input) {
      return new Date(input.seconds * 1000);
    }

    if (Array.isArray(input)) {
      return input.map(item => this.transformToSavedData(item));
    }

    if (typeof input === 'object') {
      const transformedObject: any = {};
      for (const key of Object.keys(input)) {
        transformedObject[key] = this.transformToSavedData(input[key]);
      }
      return transformedObject;
    }

    // Gib primitive Werte unverändert zurück
    return input;
  }

  getFireData(): FireData {
    return this.transformToFireData(this.getSavedData());
  }

  setUserDataFire(loadedData: any) {
    console.log('Die vom Server geladenen daten werden versucht in UserData zu speichern.')
    if(loadedData == null) {
      return;
    }

    const x = this.transformToSavedData(loadedData);

    console.log('Daten wurden erfolgreich zu savedData transformiert.');

    this.setUserData(x)
  }

  setUserData(loadedData: any) {
    if(loadedData == null) {
      return;
    }

    let savedData: SavedData = this.checkForDbUpdates(loadedData);

    this.buchungen = savedData.buchungen ?? [];
    this.buchungsKategorien = savedData.buchungsKategorien ?? [];
    this.months = this.convertSavedMonthsToMonths(savedData.savedMonths ?? []);
    this.standardFixkostenEintraege = savedData.standardFixkostenEintraege ?? [];
    this.sparschweinEintraege = savedData.sparEintraege ?? [];
    this.wunschlistenEintraege = savedData.wunschlistenEintraege ?? [];
    this.auswertungsLayouts = savedData.auswertungsLayouts ?? [];
    this.settings = savedData.settings ?? this.getDefaultSettings();
    this.geplanteAusgabenBuchungen = savedData.geplanteAusgabenBuchungen ?? [];
  }

  addKategorie(name: string): void {
    const newId = this.buchungsKategorien.length
      ? Math.max(...this.buchungsKategorien.map(k => k.id)) + 1
      : 1; // Neue ID generieren
    this.buchungsKategorien.push({id: newId, name});
  }

  getKategorienNamen(): string[] {
    return this.buchungsKategorien.map(k => k.name);
  }

  private checkForDbUpdates(data: any): SavedData {
    //return this.getLongTestData();

    if(this.useEmptyData) {
      return this.getEmptyTestData();
    }

    let currentData: any;

    data.dbVersion  //wenn keine dbVersion gespeichert wurde, wird sie auf 0 gesetzt
      ? currentData = data
      : currentData = {dbVersion: 0, ...data};

    try {
      if (currentData.dbVersion < 1) {
        currentData = this.convertToVersion1(currentData);
      }

      if (currentData.dbVersion < 2) {
        currentData = this.convertFixkostenToStandardFixkosten(currentData);
      }

      if (currentData.dbVersion < 3) {
        currentData = this.addEmptyKategorieZuAllenBuchungen(currentData);
      }

      currentData.dbVersion = currentDbVersion;
      return currentData as SavedData;
    } catch (e) {

      return {
        buchungen: [],
        buchungsKategorien: [],
        auswertungsLayouts: [],
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
        geplanteAusgabenBuchungen: [],
        dbVersion: currentDbVersion
      }
    }
  }

  getEmptyTestData(): SavedData {
    return {
      auswertungsLayouts: [],
      buchungen: [],
      buchungsKategorien: [],
      dbVersion: currentDbVersion,
      geplanteAusgabenBuchungen: [],
      savedMonths: [],
      settings: {
        tagesAnzeigeOption: TagesAnzeigeOptions.leer,
        toHighBuchungenEnabled: true,
        topBarAnzeigeEinstellung: TopBarBudgetOptions.leer,
        wunschlistenFilter: {
          selectedFilter: '',
          gekaufteEintraegeAusblenden: false
        }
      },
      sparEintraege: [],
      standardFixkostenEintraege: [],
      wunschlistenEintraege: []
    }
  }

  getLongTestData(): SavedData {
    const testSavedData: SavedData = {
      buchungen: [],
      buchungsKategorien: [
        {id: 1, name: "Lebensmittel"},
        {id: 2, name: "Miete"},
        {id: 3, name: "Freizeit"},
      ],
      savedMonths: [],
      auswertungsLayouts: [],
      standardFixkostenEintraege: [
        {
          id: 1,
          data: {title: "Miete", betrag: 1000},
        },
        {
          id: 2,
          data: {title: "Versicherungen", betrag: 200},
        },
      ],
      sparEintraege: [
        {
          id: 1,
          data: {
            date: new Date(2024, 0, 1),
            betrag: 50,
            zusatz: "Spareinlage für Urlaub",
          },
        },
      ],
      wunschlistenEintraege: [
        {
          id: 1,
          data: {
            date: new Date(2024, 0, 5),
            title: "Neue Kopfhörer",
            betrag: 200,
            gekauft: false,
            erstelltAm: new Date(2024, 0, 1),
          },
        },
      ],
      settings: {
        wunschlistenFilter: {
          gekaufteEintraegeAusblenden: true,
          selectedFilter: "alle",
        },
        toHighBuchungenEnabled: true,
        topBarAnzeigeEinstellung: undefined,
        tagesAnzeigeOption: undefined,
      },
      dbVersion: 1,
      geplanteAusgabenBuchungen: [
        {
          id: 1,
          data: {
            time: new Date().toLocaleTimeString(),
            betrag: 1,
            beschreibung: 'dfsafasd',
            date: new Date(),
            title: 'titel test'
          }
        }
      ]
    };

    for(let year = 2024; year < 2025; year++) {
      for (let month = 8; month < 12; month++) {
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Monat in `savedMonths` hinzufügen
        testSavedData.savedMonths.push({
          date: new Date(year, month),
          totalBudget: 3000,
          sparen: 500,
          uebernommeneStandardFixkostenEintraege: [],
          specialFixkostenEintraege: []
        });

        for (let day = 1; day <= daysInMonth; day++) {
          const currentDate = new Date(year, month, day);
          const dailyBuchung: IBuchung = {
            id: testSavedData.buchungen.length + 1, // Fortlaufende ID
            data: {
              date: currentDate,
              time: "12:00",
              title: `Test-Buchung ${currentDate.toDateString()}`,
              betrag: Math.floor(Math.random() * 100) + 1, // Zufälliger Betrag zwischen 1 und 100
              beschreibung: `Beschreibung für ${currentDate.toDateString()}`,
              buchungsKategorie: (day % 3) + 1, // Kategorie zyklisch (1, 2, 3)
            },
          };

          // Buchung in das Buchungen-Array hinzufügen
          testSavedData.buchungen.push(dailyBuchung);
        }
      }
    }
    return testSavedData;
  }

  private addEmptyKategorieZuAllenBuchungen(data: any) {
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

    const {buchungen: _, ...rest} = data;

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

    const {savedMonths: _, fixKosten: __, settings: ___, ...rest} = data;

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
    let buchungen = !datax.buchungen ? [] : datax.buchungen.map((buchung: any) => ({
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
    let fixkosten = !datax.fixKosten ? [] : datax.fixKosten.map((fixkosteneintrag: any) => ({
      id: fixkosteneintrag.id,
      data: {
        betrag: fixkosteneintrag.betrag,
        title: fixkosteneintrag.title,
        zusatz: fixkosteneintrag.zusatz
      }
    }));

    // Umwandlung der savedMonths
    let savedMonths = !datax.savedMonths ? [] : datax.savedMonths.map((month: any) => ({
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
    let sparEintraege: SparEintragV0[] = !datax.sparEintraege ? [] : datax.sparEintraege.map((sparEintrag: any) => ({
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
    let wunschlistenEintraege =  !datax.wunschlistenEintraege ? [] :datax.wunschlistenEintraege.map((wunschlisteEintrag: any) => ({
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
    const {buchungen: _, fixKosten: __, sparEintraege: ___, wunschlistenEintraege: ____, ...rest} = datax;

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
        wunschllistenFilter: datax.settings.wunschllistenFilter ?? {
          selectedFilter: '',
          gekaufteEintraegeAusblenden: false
        }
      },
      dbVersion: 1,
      ...rest
    };
  }

  deleteAllData() {
    this.buchungen = [];
    this.buchungsKategorien = [];
    this.months = [];
    this.standardFixkostenEintraege = [];
    this.sparschweinEintraege = [];
    this.wunschlistenEintraege = [];
    this.auswertungsLayouts = [];
    this.settings = {
      toHighBuchungenEnabled: true,
        wunschlistenFilter: {
        selectedFilter: '',
          gekaufteEintraegeAusblenden: false
      },
      tagesAnzeigeOption: TagesAnzeigeOptions.leer,
        topBarAnzeigeEinstellung: TopBarBudgetOptions.leer
    }
    this.geplanteAusgabenBuchungen = []
  }

  getSavedData(): SavedData {
    const savedData: SavedData = {
      auswertungsLayouts: [],
      buchungen: [],
      buchungsKategorien: [],
      dbVersion: currentDbVersion,
      geplanteAusgabenBuchungen: [],
      savedMonths: [],
      settings: {
        wunschlistenFilter: {selectedFilter: "", gekaufteEintraegeAusblenden: true},
        toHighBuchungenEnabled: false
      },
      sparEintraege: [],
      standardFixkostenEintraege: [],
      wunschlistenEintraege: [],
    }

    savedData.buchungen = this.buchungen;
    savedData.buchungsKategorien = this.buchungsKategorien;
    savedData.standardFixkostenEintraege = this.standardFixkostenEintraege;
    savedData.sparEintraege = this.sparschweinEintraege;
    savedData.wunschlistenEintraege = this.wunschlistenEintraege;
    savedData.auswertungsLayouts = this.auswertungsLayouts;
    savedData.settings = this.settings;
    savedData.geplanteAusgabenBuchungen = this.geplanteAusgabenBuchungen;

    this.months.forEach(month => {
      savedData.savedMonths.push({
        date: month.startDate,
        totalBudget: month.totalBudget ?? 0,
        sparen: month.sparen ?? 0,
        uebernommeneStandardFixkostenEintraege: month.uebernommeneStandardFixkostenEintraege,
        specialFixkostenEintraege: month.specialFixkostenEintraege,
        geplanteAusgaben: month.geplanteAusgaben
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

  private convertFireMonthsToMonths(savedMonths: FireMonth[]): Month[] {
    const months: Month[] = [];

    savedMonths.forEach(savedMonth => {
      const date = new Date(savedMonth.date.seconds * 1000);
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
}
