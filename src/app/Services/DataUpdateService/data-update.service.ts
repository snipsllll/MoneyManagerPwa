import { Injectable } from '@angular/core';
import {DataConverter} from "../../Models/Classes/DataConverter";
import {DbUpdateMM} from "../../Models/Classes/DbUpdateMM";
import {SavedData} from "../../Models/Interfaces";
import {DataService} from "../DataService/data.service";
import {UT} from "../../Models/Classes/UT";

@Injectable({
  providedIn: 'root'
})
export class DataUpdateService {

  private dataConverter: DataConverter = new DataConverter();
  private dbUpdateMM: DbUpdateMM = new DbUpdateMM();
  private utils: UT = new UT();

  constructor(private dataService: DataService) { }

  /**
   *
   * @param data must be in format of savedData!
   */
  getDbUpdatedSavedData(data: any): SavedData {
    console.log("...checking for DbUpdates");
    let savedDataAfterUpdate = this.dbUpdateMM.checkForUpdates(data);
    console.log("Successfully checked for DbUpdates.");
    return savedDataAfterUpdate;
  }

  deleteUserDataLocally() {
    console.log("...deleting locally saved userData");
    this.dataService.userData.setUserData(this.dataConverter.convertSavedDataToUserData(this.utils.getEmptySavedData()));
    console.log("Successfully deleted locally saved userData.");
  }

  saveFireDataInUserData(fireData: any): boolean {
    console.log("...saving fireData in userData");
    let savedDataBeforeUpdate = this.dataConverter.convertFireDataToSavedData(fireData);
    let savedDataAfterUpdate = this.getDbUpdatedSavedData(savedDataBeforeUpdate);
    let userData = this.dataConverter.convertSavedDataToUserData(savedDataAfterUpdate);
    this.dataService.userData.setUserData(userData);
    console.log("Successfully saved fireData in userData.");
    return true;
  }

  saveSavedDataInUserData(savedDataBeforeUpdate: any): boolean {
    console.log("...saving savedData in userData");
    let savedDataAfterUpdate = this.getDbUpdatedSavedData(savedDataBeforeUpdate);
    let userData = this.dataConverter.convertSavedDataToUserData(savedDataAfterUpdate);
    this.dataService.userData.setUserData(userData);
    console.log("Successfully saved savedData in userData.");
    return true;
  }
}
