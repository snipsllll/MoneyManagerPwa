import {SavedData} from "../Interfaces";
import {currentDbVersion} from "./CurrentDbVersion";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "../Enums";

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

  getEmptySavedData(): SavedData {
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
}
