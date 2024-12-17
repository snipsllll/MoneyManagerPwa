import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {AuthService} from "./auth.service";
import {SavedLoginDataManagerService} from "./saved-login-data-manager.service";
import {IDoc} from "./Models/IDoc";
import { User } from 'firebase/auth';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  loggedInUser = new BehaviorSubject<User | null>(null);
  loggedIn = new BehaviorSubject<boolean>(false);
  data = new BehaviorSubject<IDoc | null>(null);

  constructor(private router: Router, private firestoreService: FirestoreService, private authService: AuthService, private fileManager: SavedLoginDataManagerService) {
    this.tryStartupLogin();
  }

  // Login-Methode gibt ein Promise zurück
  async login(email: string, password: string){
    console.log('Login-Versuch gestartet');

    return this.authService.login(email, password)
      .then((userCredential) => {
        // User-Daten speichern
        this.loggedInUser.next(userCredential.user as User);
        this.loggedIn.next(true);
        this.router.navigate(['home']);

        // Zusätzliche Logik nach erfolgreichem Login
        this.saveLoginData(email, password);
        this.reloadData();

        console.log('Login erfolgreich:', userCredential.user);
        return userCredential.user; // Rückgabe des Users
      })
      .catch((error) => {
        //console.error('Login fehlgeschlagen:', error);
        return Promise.reject(error); // Fehler weitergeben
      });
  }

  // Logout-Methode gibt ein Promise zurück
  async logout(): Promise<void> {
    return this.authService.logout()
      .then(() => {
        console.log(89898787)
        this.loggedInUser.next(null);
        this.loggedIn.next(false);
        this.data.next(null);
        this.deleteSavedLoginData();
        this.router.navigate(['login'])
      })
      .catch(error => {
        console.error('Fehler beim Logout:', error);
        throw error; // Fehler weiterwerfen
      });
  }

  // Registrierung gibt ein Promise zurück
  async register(email: string, password: string) {
    return this.authService.register(email, password)
      .then((userCredential) => {
        console.log('Registrierung erfolgreich:', userCredential.user);
        return userCredential.user; // Rückgabe des Users
      })
      .catch((error) => {
        //console.error('Login fehlgeschlagen:', error);
        return Promise.reject(error); // Fehler weitergeben
      });
  }

  // Aktualisierung der gespeicherten Daten gibt ein Promise zurück
  async updateSavedData(savedData: IDoc): Promise<void> {
    return this.firestoreService.editSavedDataForUser(savedData, this.getUid())
      .then(() => {
        this.reloadData();
      })
      .catch(error => {
        console.error('Fehler bei der Aktualisierung der gespeicherten Daten:', error);
        throw error; // Fehler weiterwerfen
      });
  }

  // Löschen der gespeicherten Daten gibt ein Promise zurück
  async deleteSavedData(): Promise<void> {
    return this.firestoreService.deleteSavedData(this.getUid())
      .then(() => {
        this.data.next(null);
      })
      .catch(error => {
        console.error('Fehler beim Löschen der gespeicherten Daten:', error);
        throw error; // Fehler weiterwerfen
      });
  }

  // Löschen des Benutzerkontos gibt ein Promise zurück
  async deleteAccount(): Promise<void> {
    return this.authService.deleteAccount()
      .then(() => {
        return this.firestoreService.deleteUser(this.getUid());
      })
      .then(() => {
        this.logout();
        this.reloadData();
        this.router.navigate(['login'])
      })
      .catch(error => {
        console.error('Fehler beim Löschen des Benutzerkontos:', error);
        throw error; // Fehler weiterwerfen
      });
  }

  // private Methode, um die Benutzerdaten neu zu laden
  private reloadData(): void {
    this.firestoreService.getSavedDataForUser(this.getUid())
      .then(data => {
        console.log(data);
        this.data.next(data);
      })
      .catch(error => {
        console.error('Fehler beim Neuladen der Daten:', error);
      });
  }

  // private Methode, um die UID des angemeldeten Benutzers zu erhalten
  private getUid(): string | undefined {
    return this.loggedInUser.getValue()?.uid;
  }

  private tryStartupLogin() {
    const savedLoginData = this.fileManager.load();
    console.log(savedLoginData)
    if(savedLoginData.email && savedLoginData.password)
      this.login(savedLoginData.email, savedLoginData.password);
  }

  private saveLoginData(email: string, password: string) {
    this.fileManager.save({email: email, password: password})
  }

  private deleteSavedLoginData() {
    console.log(635241)
    this.fileManager.save();
  }
}
