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
    console.log("...saving data on server")
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      await collectionRef.add(dataToAdd);
      console.log('Successfully saved data on server.');
    } catch (error) {
      console.error('Error while saving data on server:', error);
    }
  }

  // Löschen von Daten
  async deleteDataOnServer(uid?: string): Promise<void> {
    console.log("...deleting data on server.")
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        console.warn(`No data for user with uid=${uid} found!`);
        return;
      }
      const docSnap = querySnapshot.docs[0];
      await docSnap.ref.delete();
      console.log(`Successfully deleted data on server.`);
    } catch (error) {
      console.error(`Error while deleting data on server!`, error);
      throw error;
    }
  }

  // Bearbeiten von gespeicherten Daten
  async updateDataOnServer(updatedData: Partial<FireData>, uid?: string): Promise<void> {
    console.log("...updating data on server")
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        const emptySavedData: SavedData = this.utils.getEmptySavedData();
        await this.saveDataOnServer(emptySavedData, uid);
        console.warn(`No document in collection 'savedData' for user with uid=${uid} was found! New savedData was created!`);
        return;
      }
      const docSnap = querySnapshot.docs[0];
      const documentRef = docSnap.ref;
      await documentRef.update(updatedData);
      console.log(`Successfully updated data on server.`);
    } catch (error) {
      console.error(`Error while updating data on server!`, error);
      throw error;
    }
  }

  // Abrufen von gespeicherten Daten
  async getDataFromServer(uid?: string): Promise<SavedData | null> {
    console.log("...downloading fireData")
    if (!uid) {
      throw new Error('User ID (uid) is required.');
    }

    const collectionRef = this.firestore.collection(`users/${uid}/savedData`);
    try {
      const querySnapshot = await lastValueFrom(collectionRef.get());
      if (querySnapshot.empty) {
        console.warn(`No entries for user with uid=${uid} was found on server! Creating new SavedData!`);
        return null;
      }
      const docSnap = querySnapshot.docs[0];
      console.log('Successfully downloaded fireData.')
      return docSnap.data() as SavedData;
    } catch (error) {
      console.error(`Error while downloading userdata for user with uid: ${uid} from server!`, error);
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
      console.log(`Successfully deleted all data for user with uid: ${uid} on server.`);
    } catch (error) {
      console.error(`Error while deleting all data for user with uid=${uid}:`, error);
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
        const newDoc = this.utils.getEmptySavedData();
        await collectionRef.add(newDoc);
        console.log(`Successfully created new dataset for user with uid=${uid}.`);
      } else {
        console.log(`User with uid=${uid} already has entries.`);
      }
    } catch (error) {
      console.error("Error while loading data from server!", error);
      throw error;
    }
  }
}
