import {Injectable} from '@angular/core';
import {User} from 'firebase/auth';
import {BehaviorSubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/compat/auth'; // Importiere AngularFireAuth

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  loggedInUser = new BehaviorSubject<User | null>(null);

  constructor(private fireauth: AngularFireAuth) {
  }

  async resetPassword(email: string) {
    return this.fireauth.sendPasswordResetEmail(email).then(() => {
      console.log('Email zum zurücksetzen des Passwortes wurde gesendet.')
    }).catch((error) => {
      console.error('Fehler beim Senden der Email zum zurücksetzen des Passwortes:', error)
      // Rückgabe eines Fehlers als abgelehntes Promise
      return Promise.reject({
        code: error.code,
        message: error.message,
      })
    });
  }

  async register(email: string, password: string) {
    return this.fireauth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        console.log('Account wurde erfolgreich registriert')
        // Rückgabe des erfolgreichen Ergebnisses
        return result;
      })
      .catch((error) => {
        console.error('Fehler beim erstellen des Accounts:', error)
        // Rückgabe eines Fehlers als abgelehntes Promise
        return Promise.reject({
          code: error.code,
          message: error.message,
        });
      });
  }

  // Login mit E-Mail und Passwort
  async login(email: string, password: string) {
    return this.fireauth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        if (result.user)
          this.loggedInUser.next(result.user as User);
        // Rückgabe des erfolgreichen Ergebnisses
        return result;
      })
      .catch((error) => {
        console.error('Fehler beim Login:', error)
        // Rückgabe eines Fehlers als abgelehntes Promise
        return Promise.reject({
          code: error.code,
          message: error.message,
        });
      });
  }

  // Logout des Benutzers
  async logout(): Promise<void> {
    await this.fireauth.signOut().then(() => {
      this.isLoggedIn = false;
      this.loggedInUser.next(null);
      console.log('User logged out successfully');
    }).catch((error) => {
      console.error('Error logging out', error);
    }); // Verwende AngularFireAuth signOut
  }

  // Löschen des Benutzerkontos
  async deleteAccount(): Promise<void> {
    try {
      const user = this.loggedInUser.getValue();
      if (!user) {
        throw new Error('Kein Benutzer ist angemeldet.');
      }

      const uid = user.uid;
      await this.fireauth.currentUser.then((currentUser) => {
        if (currentUser) {
          currentUser.delete(); // Lösche das Benutzerkonto
        }
      });
      console.log(`Benutzer mit uid=${uid} wurde erfolgreich aus Firebase gelöscht.`);

      // Abmelden des Benutzers und setzen des Status
      this.isLoggedIn = false;
      this.loggedInUser.next(null);
    } catch (error) {
      console.error('Fehler beim Löschen des Benutzers und seiner Daten:', error);
      throw error;
    }
  }
}
