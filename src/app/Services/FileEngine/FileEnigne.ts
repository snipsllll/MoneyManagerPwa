import {environment} from "../../../environments/environment";
import {SavedData} from "../../Models/Interfaces";
import {IBuchung} from "../../Models/NewInterfaces";


export class FileEngine {

  fileName: string = 'savedText.txt';
  download: boolean;
  isInProduction = environment;

  constructor(download: boolean) {
    this.download = download;
  }

  save(savedData: SavedData) {
    if(!this.isInProduction.production) {
      const blob = new Blob([JSON.stringify(savedData)], {type: 'text/plain'});
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      try {
        localStorage.setItem('savedText', JSON.stringify(savedData));
      } catch (e) {
        console.error('Fehler beim Speichern in localStorage:', e);
      }
    } else {
      localStorage.setItem('savedValue', JSON.stringify(savedData) ?? 'lol');
    }

  }

  load(): SavedData {
    /*
    return {
      buchungen: [],
      settings: {
        toHighBuchungenEnabled: true,
        showDayDifferenceInHome: true,
        wunschllistenFilter: {
          selectedFilter: '',
          gekaufteEintraegeAusblenden: false
        }
      },
      wunschlistenEintraege: [],
      sparEintraege: [],
      fixKosten: [],
      savedMonths: []
    }*/
    return this.getSavedData();
  }

  private getSavedData() {
    return JSON.parse(this.loadTextFromLocalStorage(), (key, value) => {
      // Prüfen, ob der Wert ein ISO-8601 Datum ist
      if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(value)) {
        return new Date(value); // Wenn ja, in ein Date-Objekt konvertieren
      }
      return value; // Ansonsten den Wert unverändert zurückgeben
    });
  }

  private loadTextFromLocalStorage(): string {
    try {
      let savedText: string | null;
      if(!this.isInProduction.production){
        savedText = localStorage.getItem('savedText');
      } else {
        savedText = localStorage.getItem('savedValue');
      }
      if (savedText) {
        return savedText;
      }
    } catch (e) {
      console.error('Fehler beim laden aus localStorage:', e);
    }
    return '{"buchungen":[],"savedMonths":[],"fixkosten":[]}';
  }
}
