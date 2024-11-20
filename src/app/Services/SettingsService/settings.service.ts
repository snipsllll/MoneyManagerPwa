import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  constructor() { }

  getShowDayDifferenceInHome() {
    return true;
    //return this.saveService.getSettings().showDayDifferenceInHome;
  }

  setShowDayDifferenceInHome(showDayDifferenceInHome: boolean) {
    /*
    let x = this.saveService.getSettings();
    x.showDayDifferenceInHome = showDayDifferenceInHome;
    this.saveService.setSettings(x);*/
  }

  getIsToHighBuchungenEnabled() {
    return true;
    //return this.saveService.getSettings().toHighBuchungenEnabled ?? false;
  }

  setIsToHighBuchungenEnabled(value: boolean) {
    /*
    let x = this.saveService.getSettings();
    x.toHighBuchungenEnabled = value;
    this.saveService.setSettings(x);*/
  }
}
