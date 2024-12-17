import { Injectable } from '@angular/core';
import {ISavedLoginData} from "./Models/ISavedLoginData";
import {environment} from "../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class SavedLoginDataManagerService {

  fileName: string = 'savedLoginData/savedText.txt';
  isInProduction = environment;

  constructor() { }

  save(savedLoginData?: ISavedLoginData) {
    if (!this.isInProduction.production) {
      // JSON.stringify mit Einrückung für lesbares JSON
      const readableJson = JSON.stringify(savedLoginData, null, 2);

      // JSON als Blob speichern
      const blob = new Blob([readableJson], { type: 'text/plain' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.fileName;
      a.click();
      window.URL.revokeObjectURL(url);

      try {
        // Lesbares JSON in localStorage speichern
        localStorage.setItem('savedText', readableJson);
      } catch (e) {
        console.error('Fehler beim Speichern in localStorage:', e);
      }
    } else {
      // Production: Kompaktes JSON speichern
      localStorage.setItem('savedValue', JSON.stringify(savedLoginData) ?? 'lol');
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
