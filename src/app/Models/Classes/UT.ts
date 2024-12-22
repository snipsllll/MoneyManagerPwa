import {TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";
import {currentDbVersion} from "./CurrentDbVersion";
import {SavedData} from "../Interfaces";

export class UT {
  public toFixedDown(number?: number, decimals?: number): number | undefined {
    if (number === undefined || decimals === undefined) {
      return undefined;
    }
    const numberString = number.toString();

    // Wenn keine Dezimalstelle vorhanden ist, direkt zurückgeben
    if (!numberString.includes(".")) {
      return +(number.toFixed(decimals));
    }

    const [numberVorKomma, numberNachKommaOriginal] = numberString.split(".");
    let numberNachKomma = numberNachKommaOriginal.substring(0, decimals);

    // Fehlende Dezimalstellen auffüllen, falls erforderlich
    while (numberNachKomma.length < decimals) {
      numberNachKomma += "0";
    }

    // Rückgabewert zusammenstellen
    return +(numberVorKomma + "." + numberNachKomma);
  }

  clone<T>(object: T) {
    return JSON.parse(JSON.stringify(object), (key, value) => {
      // Prüfen, ob der Wert ein ISO-8601 Datum ist
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value); // Wenn ja, in ein Date-Objekt konvertieren
      }
      return value; // Ansonsten den Wert unverändert zurückgeben
    });
  }

  getEmptyUserData(): SavedData {
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
      dbVersion: currentDbVersion,
      schuldenEintraege: []
    }
  }

  isEmailValid(email?: string) {
    if(!email)
      return false

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
