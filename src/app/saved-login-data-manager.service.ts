import { Injectable } from '@angular/core';
import { ISavedLoginData } from './Models/ISavedLoginData';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SavedLoginDataManagerService {
  private readonly fileName: string = 'savedText.txt';
  private readonly defaultData: string = '{}';
  private isInProduction: boolean = environment.production;

  constructor() {}

  /**
   * Löscht oder überschreibt gespeicherte Login-Daten.
   * Erstellt neue Daten, falls keine existieren.
   */
  deleteLoginData(): string {
    try {
      const existingData = localStorage.getItem(this.fileName);

      if (existingData) {
        console.log('Datei gefunden. Alte Daten:', existingData);

        // Überschreibe vorhandene Daten
        localStorage.setItem(this.fileName, this.defaultData);
        console.log('Alte Datei überschrieben.');
      } else {
        console.log('Keine Datei gefunden. Neue Datei wird erstellt.');

        // Speichere die Standarddaten
        localStorage.setItem(this.fileName, this.defaultData);
        console.log('Neue Datei gespeichert.');
      }
      return this.defaultData;
    } catch (e) {
      console.error('Fehler beim Zugriff auf localStorage:', e);
      return this.defaultData;
    }
  }

  /**
   * Speichert die übergebenen Login-Daten.
   * @param savedLoginData - Die zu speichernden Daten.
   */
  save(savedLoginData?: ISavedLoginData): void {
    try {
      const jsonString = this.isInProduction
        ? JSON.stringify(savedLoginData ?? this.defaultData) // Kompakte Speicherung in Produktion
        : JSON.stringify(savedLoginData ?? this.defaultData, null, 2); // Lesbares JSON in Entwicklung

      localStorage.setItem(this.fileName, jsonString);
      console.log('Daten erfolgreich in localStorage gespeichert.');

      // Nur in der Entwicklungsumgebung: JSON-Datei herunterladen
      if (!this.isInProduction) {
        this.downloadAsFile(jsonString);
      }
    } catch (e) {
      console.error('Fehler beim Speichern in localStorage:', e);
    }
  }

  /**
   * Lädt die gespeicherten Login-Daten aus dem localStorage.
   */
  load(): ISavedLoginData {
    try {
      const savedText = localStorage.getItem(this.fileName) || this.defaultData;
      return JSON.parse(savedText) as ISavedLoginData;
    } catch (e) {
      console.error('Fehler beim Laden aus localStorage:', e);
      return JSON.parse(this.defaultData);
    }
  }

  /**
   * Private Hilfsmethode, um JSON-Daten als Datei herunterzuladen.
   * @param jsonString - Der zu speichernde JSON-String.
   */
  private downloadAsFile(jsonString: string): void {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    console.log('JSON-Datei wurde heruntergeladen.');
  }
}
