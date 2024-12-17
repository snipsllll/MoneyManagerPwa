import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {AuthService} from "./auth.service";
import {SavedLoginDataManagerService} from "./saved-login-data-manager.service";
import { User } from 'firebase/auth';
import {Router} from "@angular/router";
import {DataService} from "./Services/DataService/data.service";
import {SavedData} from "./Models/Interfaces";
import {UT} from "./Models/Classes/UT";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  loggedInUser = new BehaviorSubject<User | null>(null);
  loggedIn = new BehaviorSubject<boolean>(false);
  isInitialLoad: boolean = true;

  utils = new UT();

  constructor(private dataService: DataService, private router: Router, private firestoreService: FirestoreService, private authService: AuthService, private fileManager: SavedLoginDataManagerService) {
    this.tryStartupLogin();

    this.dataService.doSave.subscribe(data => {
      if(data && data.fireData && !data.isInitialLoad) {
        console.log(777777)
        console.log(data.fireData)
        this.updateSavedData(data.fireData)
      }

    })
  }

  async loadData() {
    this.firestoreService.getSavedDataForUser(this.getUid()).then(data => {
      console.log(data);
      if(data == null) {
        this.firestoreService.addSavedDataIfNoSavedDataExists(this.getUid());
      } else {
        this.dataService.userData.setUserData(data);
        this.dataService.update(false, this.isInitialLoad);
        this.isInitialLoad = false;
      }

    });
  }

  // Login-Methode gibt ein Promise zurück
  async login(email: string, password: string, loginDatenRunterladen?: boolean){
    console.log('Login-Versuch gestartet');

    return this.authService.login(email, password)
      .then((userCredential) => {
        // User-Daten speichern
        this.loggedInUser.next(userCredential.user as User);
        this.loggedIn.next(true);
        this.router.navigate(['home']);

        // Zusätzliche Logik nach erfolgreichem Login
        if(loginDatenRunterladen !== false)
          this.saveLoginData(email, password);

        this.reloadData();
        console.log('Login erfolgreich:', userCredential.user);
        this.loadData();
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
        this.dataService.userData.setUserData(this.utils.getEmptyUserData());
        //TODO userData in dataService auf null setzten oder halt emoptyUserData
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
  async updateSavedData(savedData: SavedData): Promise<void> {
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
        //TODO userData in dataService auf null setzten oder halt emoptyUserData
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
        //TODO userData in dataService auf data setzen
      })
      .catch(error => {
        console.error('Fehler beim Neuladen der Daten:', error);
      });
  }

  // private Methode, um die UID des angemeldeten Benutzers zu erhalten
  private getUid(): string | undefined {
    console.log(this.loggedInUser.getValue()?.uid)
    return this.loggedInUser.getValue()?.uid;
  }

  private tryStartupLogin() {
    const savedLoginData = this.fileManager.load();
    console.log(savedLoginData)
    if(savedLoginData.email && savedLoginData.password)
      this.login(savedLoginData.email, savedLoginData.password, false);
  }

  private saveLoginData(email: string, password: string) {
    this.fileManager.save({email: email, password: password})
  }

  private deleteSavedLoginData() {
    console.log(635241)
    this.fileManager.save();
  }
}
