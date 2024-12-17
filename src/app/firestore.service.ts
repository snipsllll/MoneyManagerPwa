import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { IDoc } from './Models/IDoc';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {

  constructor(private firestore: AngularFirestore) {}

  // Hinzufügen von Daten
  async addSavedData(dataToAdd: IDoc, uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      await collectionRef.add(dataToAdd);
      console.log('savedData erfolgreich hinzugefügt:', dataToAdd);
    } catch (error) {
      console.error('Fehler beim Hinzufügen von savedData:', error);
      throw error;
    }
  }

  // Löschen von Daten
  async deleteSavedData(uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        console.warn(`Kein savedData für Benutzer mit uid=${uid} gefunden.`);
        return;
      }
      const docSnap = querySnapshot.docs[0];
      await docSnap.ref.delete();
      console.log(`savedData für Benutzer mit uid=${uid} erfolgreich gelöscht.`);
    } catch (error) {
      console.error(`Fehler beim Löschen von savedData für Benutzer mit uid=${uid}:`, error);
      throw error;
    }
  }

  // Bearbeiten von gespeicherten Daten
  async editSavedDataForUser(updatedData: Partial<IDoc>, uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        const newDoc: IDoc = {
          value: updatedData.value || 0,
          text: updatedData.text || 'Default Title',
        };
        await this.addSavedData(newDoc, uid);
        console.warn(`Keine Dokumente in der Collection 'savedData' für Benutzer mit uid=${uid} gefunden. Neues savedData wurde erstellt.`);
        return;
      }
      const docSnap = querySnapshot.docs[0];
      const documentRef = docSnap.ref;
      await documentRef.update(updatedData);
      console.log(`Das Dokument in der Collection 'savedData' wurde erfolgreich aktualisiert:`, updatedData);
    } catch (error) {
      console.error(`Fehler beim Bearbeiten des Dokuments in der Collection 'savedData' für Benutzer mit uid=${uid}:`, error);
      throw error;
    }
  }

  // Abrufen von gespeicherten Daten
  async getSavedDataForUser(uid?: string): Promise<IDoc | null> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        console.warn(`Keine Dokumente in der Collection 'savedData' für Benutzer mit uid=${uid} gefunden.`);
        return null;
      }
      const docSnap = querySnapshot.docs[0];
      return docSnap.data() as IDoc;
    } catch (error) {
      console.error(`Fehler beim Abrufen des Dokuments in der Collection 'savedData' für Benutzer mit uid=${uid}:`, error);
      throw error;
    }
  }

  // Hinzufügen eines Benutzers
  async addUser(uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const userDocRef = this.firestore.doc(`users/${uid}`);
    try {
      await userDocRef.set({
        createdAt: new Date(),
        eintraegeInitialized: true,
      });

      const savedDataCollectionRef = this.firestore.collection(`users/${uid}/savedData`);
      await savedDataCollectionRef.add({ initialized: true });

      console.log(`Benutzer mit uid=${uid} erfolgreich hinzugefügt und die Sammlung 'savedData' erstellt.`);
    } catch (error) {
      console.error(`Fehler beim Hinzufügen eines Benutzers mit uid=${uid}:`, error);
      throw error;
    }
  }

  // Löschen eines Benutzers
  async deleteUser(uid?: string): Promise<void> {
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const userDocRef = this.firestore.doc(`users/${uid}`);
    const savedDataCollectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(savedDataCollectionRef.get());
      for (const docSnap of querySnapshot.docs) {
        await docSnap.ref.delete();
        console.log(`Dokument ${docSnap.id} aus der Sammlung 'savedData' von Benutzer ${uid} gelöscht.`);
      }
      await userDocRef.delete();
      console.log(`Benutzer mit uid=${uid} und alle zugehörigen Daten erfolgreich gelöscht.`);
    } catch (error) {
      console.error(`Fehler beim Löschen des Benutzers mit uid=${uid}:`, error);
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
        const newSavedData: IDoc = {
          value: 0,
          text: "Default Entry",
        };
        await collectionRef.add(newSavedData);
        console.log(`Kein gespeichertes Data für Benutzer mit uid=${uid} gefunden. Ein neuer Eintrag wurde hinzugefügt.`);
      } else {
        console.log(`Benutzer mit uid=${uid} hat bereits Einträge.`);
      }
    } catch (error) {
      console.error(`Fehler beim Abrufen der gespeicherten Daten: ${error}`);
      throw error;
    }
  }
}