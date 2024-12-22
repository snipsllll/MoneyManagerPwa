import {Injectable} from '@angular/core';
import {AngularFirestore} from '@angular/fire/compat/firestore';
import {lastValueFrom} from 'rxjs';
import {FireData, SavedData} from "./Models/Interfaces";
import {UT} from "./Models/Classes/UT";

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  utils = new UT();

  constructor(private firestore: AngularFirestore) {
  }

  // Hinzufügen von Daten
  private async saveDataOnServer(dataToAdd: SavedData, uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      await collectionRef.add(dataToAdd);
      console.log('Daten wurden auf Server gespeichert!');
    } catch (error) {
      console.error('Fehler beim Speichern der Daten auf dem Server', error);
    }
  }

  // Löschen von Daten
  async deleteDataOnServer(uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        console.warn(`Kein Daten auf dem Server für Benutzer mit uid=${uid} gefunden.`);
        return;
      }
      const docSnap = querySnapshot.docs[0];
      await docSnap.ref.delete();
      console.log(`Daten wurden auf dem Server gelöscht!`);
    } catch (error) {
      console.error(`Fehler beim Löschen aller Daten auf dem Server`, error);
      throw error;
    }
  }

  // Bearbeiten von gespeicherten Daten
  async updateDataOnServer(updatedData: Partial<FireData>, uid?: string): Promise<void> {
    console.log(updatedData)
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        const emptySavedData: SavedData = this.utils.getEmptyUserData();
        await this.saveDataOnServer(emptySavedData, uid);
        console.warn(`Keine Dokumente in der Collection 'savedData' für Benutzer mit uid=${uid} gefunden. Neues savedData wurde erstellt.`);
        return;
      }
      const docSnap = querySnapshot.docs[0];
      const documentRef = docSnap.ref;
      await documentRef.update(updatedData);
      console.log(`Daten wurde erfolgreich auf dem Server aktualisiert.`);
    } catch (error) {
      console.error(`Fehler beim Aktualisieren der Daten auf dem Server:`, error);
      throw error;
    }
  }

  // Abrufen von gespeicherten Daten
  async getDataFromServer(uid?: string): Promise<SavedData | null> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        console.warn(`Daten konnten nicht vom Server geladen werden. Keine Daten für Benutzer mit uid=${uid} auf dem Server gefunden.`);
        return null;
      }
      const docSnap = querySnapshot.docs[0];
      console.log('Daten wurden erfolgreich von Server heruntergeladen.')
      return docSnap.data() as SavedData;
    } catch (error) {
      console.error(`Fehler beim Abrufen der Daten für Benutzer mit uid=${uid} vom Server:`, error);
      throw error;
    }
  }

  // Löschen eines Benutzers
  async deleteAccountData(uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const userDocRef = this.firestore.doc(`users/${uid}`);
    const savedDataCollectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(savedDataCollectionRef.get());
      for (const docSnap of querySnapshot.docs) {
        await docSnap.ref.delete();
      }
      await userDocRef.delete();
      console.log(`Alle Daten von Benutzer ${uid} wurde vom Server gelöscht.`);
    } catch (error) {
      console.error(`Fehler beim Löschen des Accounts von Benutzer mit uid=${uid}:`, error);
      throw error;
    }
  }

  // Hinzufügen von Daten, wenn noch keine vorhanden sind
  async addSavedDataIfNoSavedDataExists(uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        const newDoc = this.utils.getEmptyUserData();
        await collectionRef.add(newDoc);
        console.log(`Neuer Datensatz für Benutzer mit uid=${uid} wurde erstellt.`);
      } else {
        console.log(`Benutzer mit uid=${uid} hat bereits Einträge.`);
      }
    } catch (error) {
      console.error(`Fehler beim Abrufen der gespeicherten Daten: ${error}`);
      throw error;
    }
  }
}
