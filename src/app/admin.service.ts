import {Injectable} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {FirestoreService} from "./firestore.service";
import {AuthService} from "./auth.service";
import {SavedLoginDataManagerService} from "./saved-login-data-manager.service";
import {User} from 'firebase/auth';
import {DataService} from "./Services/DataService/data.service";
import {FireData} from "./Models/Interfaces";
import {UT} from "./Models/Classes/UT";
import {DialogService} from "./Services/DialogService/dialog.service";
import {TempService} from "./temp.service";
import {Router} from "@angular/router";
import {DataUpdateService} from "./Services/DataUpdateService/data-update.service";

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  loggedInUser = new BehaviorSubject<User | null>(null);
  loggedIn = new BehaviorSubject<boolean>(false);
  isInitialLoad: boolean = true;
  isDataLoading = new BehaviorSubject<boolean>(true);
  isSomethingLoading = new BehaviorSubject<boolean>(false);

  utils = new UT();

  constructor(private dataUpdateService: DataUpdateService, private tempService: TempService, private dialogService: DialogService, private dataService: DataService, private router: Router, private firestoreService: FirestoreService, private authService: AuthService, private fileManager: SavedLoginDataManagerService) {
    this.tryStartupLogin();

    this.dataService.doFireSave.subscribe(data => {
      if (data && data.fireData && !data.isInitialLoad) {
        this.saveDataOnServer(data.fireData);
      }

    })
  }

  async sendResetPasswordEmail(email?: string) {
    return this.authService.resetPassword(email ?? this.loggedInUser.getValue()?.email!).catch((error) => {
      return Promise.reject(error);
    });
  }

  async loadData() {
    this.isSomethingLoading.next(true);
    this.firestoreService.getDataFromServer(this.getUid()).then(data => {
      if (data == null) {
        this.firestoreService.addSavedDataIfNoSavedDataExists(this.getUid()).then(() => {
          this.firestoreService.getDataFromServer(this.getUid()).then(dataAfterCreating => {
            this.dataUpdateService.saveFireDataInUserData(dataAfterCreating);
            this.dataService.update(false, this.isInitialLoad);
            this.isInitialLoad = false;
            this.isDataLoading.next(false);
            this.isSomethingLoading.next(false);
          });
        });
      } else {
        this.dataUpdateService.saveFireDataInUserData(data);
        this.dataService.update(false, this.isInitialLoad);
        this.isInitialLoad = false;
        this.isDataLoading.next(false);
        this.isSomethingLoading.next(false);
      }
    });
  }

  // Login-Methode gibt ein Promise zurück
  async login(email: string, password: string, loginDatenRunterladen?: boolean, redirectUrl?: string) {
    this.isSomethingLoading.next(true);
    return this.authService.login(email, password)
      .then((userCredential) => {
        // User-Daten speichern
        this.loggedInUser.next(userCredential.user as User);
        this.loggedIn.next(true);
        this.router.navigate([redirectUrl ?? 'home']);

        // Zusätzliche Logik nach erfolgreichem Login
        if (loginDatenRunterladen !== false)
          this.saveLoginDataLocal(email, password);

        this.loadData();
        this.isSomethingLoading.next(false);
        return userCredential.user; // Rückgabe des Users
      })
      .catch((error) => {
        this.isSomethingLoading.next(false);
        //console.error('Login fehlgeschlagen:', error);
        return Promise.reject(error); // Fehler weitergeben
      });
  }

  // Logout-Methode gibt ein Promise zurück
  async logout(): Promise<void> {
    this.isSomethingLoading.next(true);
    return this.authService.logout()
      .then(() => {
        this.loggedInUser.next(null);
        this.loggedIn.next(false);
        this.dataUpdateService.deleteUserDataLocally();
        this.deleteLocalSavedLoginData();
        this.isSomethingLoading.next(false);
        this.router.navigate(['login']);
      })
      .catch(error => {
        this.isSomethingLoading.next(false);
        console.error('Fehler beim Logout:', error);
        throw error;
      });
  }

  // Registrierung gibt ein Promise zurück
  async register(email: string, password: string) {
    this.isSomethingLoading.next(true);
    return this.authService.register(email, password)
      .then((userCredential) => {
        this.router.navigate(['login']);
        this.dialogService.showNotificationPopup({text: 'Erfolgreich registriert!'});
        this.tempService.dataUsedForRegister = {
          email: email,
          password: password
        }
        this.isSomethingLoading.next(false);
        return userCredential.user; // Rückgabe des Users
      })
      .catch((error) => {
        this.isSomethingLoading.next(false);
        return Promise.reject(error); // Fehler weitergeben
      });
  }

  // Aktualisierung der gespeicherten Daten gibt ein Promise zurück
  async saveDataOnServer(fireData: FireData): Promise<void> {
    this.isSomethingLoading.next(true);
    return this.firestoreService.updateDataOnServer(fireData, this.getUid()).then(() => {
      this.isSomethingLoading.next(false);
    }).catch(error => {
      this.isSomethingLoading.next(false);
      console.error('Fehler bei der Aktualisierung der gespeicherten Daten:', error);
      throw error; // Fehler weiterwerfen
    });
  }

  // Löschen der gespeicherten Daten gibt ein Promise zurück
  async deleteAllDataOnServer(): Promise<void> {
    this.isSomethingLoading.next(true);
    return this.firestoreService.deleteDataOnServer(this.getUid())
      .then(() => {
        this.isSomethingLoading.next(false);
      })
      .catch(error => {
        this.isSomethingLoading.next(false);
        console.error('Fehler beim Löschen der gespeicherten Daten:', error);
        throw error; // Fehler weiterwerfen
      });
  }

  // Löschen des Benutzerkontos gibt ein Promise zurück
  async deleteAccount(): Promise<void> {
    this.isSomethingLoading.next(true);
    return this.authService.deleteAccount()
      .then(() => {
        return this.firestoreService.deleteAccountData(this.getUid()).then(() => {
          this.dataUpdateService.deleteUserDataLocally();
          this.logout().then(() => {
            this.isSomethingLoading.next(false);
          });
        })
      })
      .catch(error => {
        this.isSomethingLoading.next(false);
        throw error; // Fehler weiterwerfen
      });
  }

  // private Methode, um die UID des angemeldeten Benutzers zu erhalten
  private getUid(): string | undefined {
    return this.loggedInUser.getValue()?.uid;
  }

  private tryStartupLogin() {
    const savedLoginData = this.fileManager.load();
    if (savedLoginData.email && savedLoginData.password) {
      this.tempService.dataUsedForRegister = {
        email: savedLoginData.email,
        password: savedLoginData.password
      };
      this.tempService.isTryingAutoLogin.next(true);
      let redirectUrl = this.router.url;
      if (redirectUrl === '/') {
        redirectUrl = 'home';
      }
      this.login(savedLoginData.email, savedLoginData.password, false, redirectUrl).then(() => {
        this.tempService.isTryingAutoLogin.next(false);
      }).catch((error) => {
        this.tempService.autoLoginError.next(error);
        this.tempService.isTryingAutoLogin.next(false);
      });
    }
  }

  private saveLoginDataLocal(email: string, password: string) {
    this.fileManager.save({email: email, password: password})
  }

  private deleteLocalSavedLoginData() {
    this.fileManager.deleteLoginData();
  }
}
