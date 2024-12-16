import { Injectable } from '@angular/core';
import {ISavedLoginData} from "./Models/ISavedLoginData";

@Injectable({
  providedIn: 'root'
})
export class SavedLoginDataManagerService {

  fileName: string = 'savedLoginData/savedText.txt';
  previousBlobUrl?: string | null;

  constructor() { }

  save(savedLoginData?: ISavedLoginData) {
    // Static reference for the previous URL (to revoke old object URLs)
    if (!this.previousBlobUrl) {
      this.previousBlobUrl = null;
    }

    // JSON.stringify mit Einrückung für lesbares JSON
    const readableJson = JSON.stringify(savedLoginData ?? '{}', null, 2);

    // JSON als Blob speichern
    const blob = new Blob([readableJson], { type: 'text/plain' });

    // Vorherigen Blob freigeben, um unnötige Speicherbelegung zu verhindern
    if (this.previousBlobUrl) {
      window.URL.revokeObjectURL(this.previousBlobUrl);
    }

    const url = window.URL.createObjectURL(blob);
    this.previousBlobUrl = url; // Speichere die aktuelle URL, um sie später freizugeben

    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();

    try {
      // Lesbares JSON in localStorage speichern
      localStorage.setItem(this.fileName, readableJson);
      console.log('Data was saved. Saved Login Data:', savedLoginData);
    } catch (e) {
      console.error('Fehler beim Speichern in localStorage:', e);
    }
  }

  load(): ISavedLoginData {
    return JSON.parse(this.loadTextFromLocalStorage());
  }

  private loadTextFromLocalStorage(): string {
    try {
      let savedText = localStorage.getItem(this.fileName);
      console.log(savedText)
      if (savedText !== undefined && savedText !== null) {
        console.log(663636)
        return savedText;
      }
      return '{}';
    } catch (e) {
      console.error('Fehler beim laden aus localStorage:', e);
    }
    return '{}';
  }
}
