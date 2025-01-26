import {FireData, IGeplanteAusgabenBuchung, Month, SavedData, Settings} from "../Interfaces";
import {IBuchung, IFixkostenEintrag, ISparschweinEintrag, IUserData, IWunschlistenEintrag} from "../NewInterfaces";
import {currentDbVersion} from "./CurrentDbVersion";
import {FixkostenPeriods, TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";
import {IAuswertungsLayout} from "../Auswertungen-Interfaces";

export class UserData {

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
    this.initzializeUserData();
  }

  setUserData(userData: IUserData) {
    if(!userData) {
      throw new Error("Error while setting userData. inputted userData isn`t allowd to be null or undefined!")
    }

    this.buchungen = userData.buchungen ?? [];
    this.buchungsKategorien = userData.buchungsKategorien ?? [];
    this.months = userData.months ?? [];
    this.sparschweinEintraege = userData.sparschweinEintraege ?? [];
    this.wunschlistenEintraege = userData.wunschlistenEintraege ?? [];
    this.auswertungsLayouts = userData.auswertungsLayouts ?? [];
    this.settings = userData.settings ?? this.getDefaultSettings();
    this.geplanteAusgabenBuchungen = userData.geplanteAusgabenBuchungen ?? [];
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

  addKategorie(name: string): void {
    const newId = this.buchungsKategorien.length
      ? Math.max(...this.buchungsKategorien.map(k => k.id)) + 1
      : 1; // Neue ID generieren
    this.buchungsKategorien.push({id: newId, name});
  }

  getKategorienNamen(): string[] {
    return this.buchungsKategorien.map(k => k.name);
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
          data: {title: "Miete", betrag: 1000, period: FixkostenPeriods.Month},
        },
        {
          id: 2,
          data: {title: "Versicherungen", betrag: 200, period: FixkostenPeriods.Month},
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

  private initzializeUserData() {
    this.buchungen =  [];
    this.buchungsKategorien =  [];
    this.months =  [];
    this.sparschweinEintraege =  [];
    this.wunschlistenEintraege =  [];
    this.auswertungsLayouts =  [];
    this.settings =  this.getDefaultSettings();
    this.geplanteAusgabenBuchungen =  [];
  }
}
