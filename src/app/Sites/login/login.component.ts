import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {AdminService} from "../../admin.service";
import {versionName} from "../../Models/Classes/versionName";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  email?: string;
  pw?: string;

  isEmailRed = false;
  isPwRed = false;

  errorMessage?: string = '';

  isLoading = false;

  constructor(private adminService: AdminService, private router: Router) {
  }

  onLoginClicked() {
    this.updateEmailErrors();
    this.updatePasswordErrors();
    this.updateErrorText();

    if (this.isEmailValid() && this.isPasswordValid()) {
      this.errorMessage = undefined;
      this.login();
    }
  }

  onEmailChange() {
    this.isEmailRed = false;
  }

  onPwChange() {
    this.isPwRed = false;
  }

  onRegisterClicked() {
    this.router.navigate(['register']);
  }

  private updateEmailErrors() {
    this.isEmailRed = !this.isEmailValid();
  }

  private updatePasswordErrors() {
    this.isPwRed = !this.isPasswordValid();
  }

  private updateErrorText() {
    if (!this.isEmailValid()) {
      this.errorMessage = 'Bitte geben Sie eine gültige Email-adresse an!'
      return;
    }

    if (!this.isPasswordValid()) {
      this.errorMessage = 'Bitte geben Sie eine Passwort an!'
    }
  }

  private isEmailValid() {
    if (!this.email) {
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(this.email);
  }

  private isPasswordValid() {
    if (!this.pw) {
      return false;
    }

    return true;
  }

  private async login() {
    if (!this.email || !this.pw) {
      throw new Error('E-Mail oder Passwort war leer');
    }

    try {
      this.isLoading = true;
      const user = await this.adminService.login(this.email, this.pw);
      this.isLoading = false;
      console.log('Willkommen,', user?.email);
    } catch (error) {
      console.log('Login fehlgeschlagen:', error);
      this.errorMessage = 'E-Mail-Adresse oder Passwort ist falsch.'
      this.isLoading = false;
      // Fehleranzeige im UI (optional)
    }
  }

  protected readonly versionName = versionName;
}


import {environment} from "../../../environments/environment";
import {SavedData} from "../../Models/Interfaces";


export class FileEngine {

  fileName: string = 'savedText.txt';
  download: boolean;
  isInProduction = environment;

  constructor(download: boolean) {
    this.download = download;
  }

  save(savedData: SavedData) {
    console.log('data was saved. Saved Data:', savedData);
    if (!this.isInProduction.production) {
      // JSON.stringify mit Einrückung für lesbares JSON
      const readableJson = JSON.stringify(savedData, null, 2);

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
