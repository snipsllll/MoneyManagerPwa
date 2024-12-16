import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importiere AngularFireAuth

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  loggedInUser = new BehaviorSubject<User | null>(null);

  constructor(private fireauth: AngularFireAuth) {}

  async register(email: string, password: string): Promise<User> {
    try {
      const userCredential = await this.fireauth.createUserWithEmailAndPassword(email, password);
      console.log('User registered successfully', userCredential);

      // Sicherstellen, dass wir den richtigen Rückgabewert liefern
      return userCredential.user as User;
    } catch (error) {
      console.error('Error registering user', error);
      throw error;
    }
  }

  // Login mit E-Mail und Passwort
  async login(email: string, password: string): Promise<User> {
    try {
      const userCredential = await this.fireauth.signInWithEmailAndPassword(email, password);
      console.log('User logged in successfully', userCredential);
      this.loggedInUser.next(userCredential.user as User);
      this.isLoggedIn = true;
      return userCredential.user as User;
    } catch (error) {
      console.error('Error logging in', error);
      throw error;
    }
  }

  // Logout des Benutzers
  async logout(): Promise<void> {
    try {
      await this.fireauth.signOut(); // Verwende AngularFireAuth signOut
      this.isLoggedIn = false;
      this.loggedInUser.next(null);
      console.log('User logged out successfully');
    } catch (error) {
      console.error('Error logging out', error);
      throw error;
    }
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
