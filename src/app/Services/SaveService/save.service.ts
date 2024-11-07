import { Injectable } from '@angular/core';
import {
  Buchung,
  FixKostenEintrag, SavedData,
  SavedMonth,
  Settings,
  SparschweinEintrag,
  WunschlistenEintrag
} from "../../Models/Interfaces";
import {FileEngine} from "../FileEngine/FileEnigne";
import {DB} from "../../Models/Enums";

@Injectable({
  providedIn: 'root'
})
export class SaveService {

  private _buchungen!: Buchung[];
  private _savedMonths!: SavedMonth[];
  private _fixKosten!: FixKostenEintrag[];
  private _sparEintraege!: SparschweinEintrag[];
  private _wunschlistenEintraege!: WunschlistenEintrag[];
  private _settings!: Settings;

  private _fileEngine: FileEngine = new FileEngine(DB.noTD, true);

  constructor() {
    this.load();
  }

  load() {
    const savedData = this._fileEngine.load();
    this._buchungen = savedData.buchungen;
    this._savedMonths = savedData.savedMonths;
    this._fixKosten = savedData.fixKosten;
    this._sparEintraege = savedData.sparEintraege;
    this._wunschlistenEintraege = savedData.wunschlistenEintraege;
    this._settings = savedData.settings;
  }

  private save() {
    const savedData: SavedData = {
      buchungen: this._buchungen,
      savedMonths: this._savedMonths,
      fixKosten: this._fixKosten,
      sparEintraege: this._sparEintraege,
      wunschlistenEintraege: this._wunschlistenEintraege,
      settings: this._settings,
    }

    this._fileEngine.save(savedData);
  }

  saveChanges() {
    this.save();
  }

  getBuchungen() {
    return this._buchungen;
  }

  setBuchungen(value: Buchung[]){
    this._buchungen = value;
  }

  getSavedMonths() {
    return this._savedMonths;
  }

  setSavedMonths(value: SavedMonth[]){
    this._savedMonths = value;
  }

  getFixKosten() {
    return this._fixKosten;
  }

  setFixKosten(value: FixKostenEintrag[]) {
    this._fixKosten = value;
  }

  getSparEintraege() {
    return this._sparEintraege;
  }

  setSparEintraege(value: SparschweinEintrag[]) {
    this._sparEintraege = value;
  }

  getWunschlistenEintraege() {
    return this._wunschlistenEintraege;
  }

  setWunschlistenEintraege(value: WunschlistenEintrag[]) {
    this._wunschlistenEintraege = value;
  }

  getSettings() {
    return this._settings;
  }

  setSettings(value: Settings) {
    this._settings = value;
    this.save();
  }
}
