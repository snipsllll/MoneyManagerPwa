import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  showDayDifferenceInHome: boolean = false;

  constructor() { }
}
