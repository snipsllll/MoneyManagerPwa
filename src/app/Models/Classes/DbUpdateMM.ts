import {currentDbVersion} from "./CurrentDbVersion";
import {SavedData} from "../Interfaces";
import {FixkostenPeriods, TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";
import {IFixkostenEintrag} from "../NewInterfaces";

export class DbUpdateMM {

  checkForUpdates(data: any): SavedData {
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

      if (currentData.dbVersion < 4) {
        currentData = this.AddPeriodeToFixkosten(currentData);
      }

      currentData.dbVersion = currentDbVersion;
      return currentData as SavedData;
    } catch (e) {
      console.log(e)

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

  private AddPeriodeToFixkosten(data: any): any {
    try {
      // Validate input data
      if (!data || !Array.isArray(data.standardFixkostenEintraege)) {
        throw new Error('Input data is undefined, null, or invalid!');
      }

      // Transform standardFixkostenEintraege, safely accessing nested properties
      let updatedFixkostenEintraege = data.standardFixkostenEintraege.map((fixkosteneintrag: any) => ({
        id: fixkosteneintrag.id || null,
        data: {
          betrag: fixkosteneintrag?.data?.betrag || 0,
          title: fixkosteneintrag?.data?.title || '',
          beschreibung: fixkosteneintrag?.data?.beschreibung || '',
          period: FixkostenPeriods.Month // Assign default period
        }
      }));

      // Exclude standardFixkostenEintraege from the rest of the data
      const { standardFixkostenEintraege: _, ...rest } = data;

      // Return the updated structure
      return {
        standardFixkostenEintraege: updatedFixkostenEintraege,
        ...rest
      };
    } catch (e) {
      // Log the error with more context
      console.error('Error in AddPeriodeToFixkosten!', e);
      return null; // Return null or an appropriate fallback value
    }
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
    let wunschlistenEintraege = !datax.wunschlistenEintraege ? [] : datax.wunschlistenEintraege.map((wunschlisteEintrag: any) => ({
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
}
