import { Injectable } from '@angular/core';
import {SaveService} from "../SaveService/save.service";

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor(private saveService: SaveService) { }

  getShowDayDifferenceInHome() {
    return this.saveService.getSettings().showDayDifferenceInHome;
  }

  setShowDayDifferenceInHome(showDayDifferenceInHome: boolean) {
    let x = this.saveService.getSettings();
    x.showDayDifferenceInHome = showDayDifferenceInHome;
    this.saveService.setSettings(x);
  }

  getIsToHighBuchungenEnabled() {
    return this.saveService.getSettings().toHighBuchungenEnabled ?? false;
  }

  setIsToHighBuchungenEnabled(value: boolean) {
    let x = this.saveService.getSettings();
    x.toHighBuchungenEnabled = value;
    this.saveService.setSettings(x);
  }
}
