import {Injectable} from '@angular/core';
import {
  IBuchung,
  IBuchungData,
  IFixkostenEintrag,
  IFixkostenEintragData,
  IMonthFixkostenEintrag,
  ISparschweinEintrag,
  ISparschweinEintragData,
  IWunschlistenEintrag,
  IWunschlistenEintragData
} from "../../Models/NewInterfaces";
import {DataService} from "../DataService/data.service";
import {IAuswertungsLayout, IAuswertungsLayoutData} from "../../Models/Auswertungen-Interfaces";
import {IGeplanteAusgabe, IGeplanteAusgabenBuchung, IGeplanteAusgabenBuchungData} from "../../Models/Interfaces";

@Injectable({
  providedIn: 'root'
})
export class DataChangeService {

  constructor(private dataService: DataService) { }

  addBuchung(buchungData: IBuchungData): void {
    if(buchungData.geplanteBuchung) {
      this.addGeplanteAusgabeBuchung(buchungData);
    } else {
      const newBuchung: IBuchung = {
        id: this.getNextFreeBuchungId(),
        data: buchungData
      };

      this.dataService.createNewMonthIfNecessary(newBuchung.data.date);
      this.dataService.userData.buchungen.push(newBuchung);
      this.dataService.update();
    }
  }

  editBuchung(editedBuchung: IBuchung): void {
    this.dataService.userData.buchungen[this.getIndexOfBuchungById(editedBuchung.id)] = editedBuchung;
    this.dataService.update();
  }

  deleteBuchung(buchungId: number) {
    this.dataService.userData.buchungen.splice(this.getIndexOfBuchungById(buchungId), 1);
    this.dataService.update();
  }

  addGeplanteAusgabeBuchung(buchungData: IGeplanteAusgabenBuchungData): void {
    const newGeplanteAusgabenBuchung: IGeplanteAusgabenBuchung = {
      id: this.getNextFreeGeplanteAusgabenBuchungId(),
      data: buchungData
    };

    this.dataService.createNewMonthIfNecessary(newGeplanteAusgabenBuchung.data.date);
    this.dataService.userData.geplanteAusgabenBuchungen.push(newGeplanteAusgabenBuchung);
    this.dataService.update();
  }

  editGeplanteAusgabeBuchung(editedGeplanteAusgabenBuchung: IGeplanteAusgabenBuchung): void {
    this.dataService.userData.geplanteAusgabenBuchungen[this.getIndexOfGeplanteAusgabenBuchungById(editedGeplanteAusgabenBuchung.id)] = editedGeplanteAusgabenBuchung;
    this.dataService.update();
  }

  deleteGeplanteAusgabeBuchung(id: number) {
    this.dataService.userData.geplanteAusgabenBuchungen.splice(this.getIndexOfGeplanteAusgabenBuchungById(id), 1);
    this.dataService.update();
  }

  addAuswertungsLayout(auswertungsLayoutData: IAuswertungsLayoutData): void {
    const newAuswertungsLayout: IAuswertungsLayout = {
      id: this.getNextFreeAuswertungLayoutId(),
      data: auswertungsLayoutData
    };

    this.dataService.userData.auswertungsLayouts.push(newAuswertungsLayout);
    this.dataService.update();
  }

  editAuswertungsLayout(editedAuswertungsLayout: IAuswertungsLayout): void {
    this.dataService.userData.auswertungsLayouts[this.getIndexOfAuswertungsLayoutById(editedAuswertungsLayout.id)] = editedAuswertungsLayout;
    this.dataService.update();
  }

  deleteAuswertungsLayout(auswertungsLayoutId: number) {
    this.dataService.userData.auswertungsLayouts.splice(this.getIndexOfAuswertungsLayoutById(auswertungsLayoutId), 1);
    this.dataService.update();
  }

  addFixkostenEintrag(fixkostenEintragData: IFixkostenEintragData): void {
    const newFixkostenEintrag: IFixkostenEintrag = {
      id: this.getNextFreeFixkostenEintragId(),
      data: fixkostenEintragData
    };

    this.dataService.userData.standardFixkostenEintraege.push(newFixkostenEintrag);
    this.dataService.update();
  }

  editFixkostenEintrag(editedFixkostenEintrag: IFixkostenEintrag): void {
    this.dataService.userData.standardFixkostenEintraege[this.getIndexOfFixkostenEintragById(editedFixkostenEintrag.id)] = editedFixkostenEintrag;
    this.dataService.update();
  }

  editGeplanteAusgabenEintraegeForMonth(date: Date, elemente: IGeplanteAusgabe[]) {
    this.dataService.createNewMonthIfNecessary(date);
    const month = this.dataService.userData.months.find(month => month.startDate.toLocaleDateString() === date.toLocaleDateString());
    if(month === undefined) {
      throw new Error("error in dataChangeService editGeplanteAusgabenEintraegeForMonth: Month is undefined!");
    }

    month.geplanteAusgaben = [];

    elemente.forEach(element => {
      month.geplanteAusgaben?.push({
        id: this.getNextFreeGeplanteAusgabeId(),
        data: {
          betrag: element.data.betrag,
          title: element.data.title,
          beschreibung: element.data.beschreibung
        }
      })
    })
  }

  editFixkostenEintraegeForMonth(date: Date, elemente: IMonthFixkostenEintrag[]) {
    this.dataService.createNewMonthIfNecessary(date);
    const month = this.dataService.userData.months.find(month => month.startDate.toLocaleDateString() === date.toLocaleDateString());
    if(month === undefined) {
      throw new Error("error in dataChangeService editFixckostenEintraegeForMonth: Month is undefined!");
    }

    month.uebernommeneStandardFixkostenEintraege = [];
    month.specialFixkostenEintraege = [];

    elemente.forEach(element => {
      if(element.data.isStandardFixkostenEintrag === true) {
        if(this.dataService.userData.standardFixkostenEintraege.findIndex(x => x.id === element.id) === -1) {
          month.specialFixkostenEintraege?.push({
            id: this.getNextFreeFixkostenEintragId(),
            data: {
              title: element.data.title,
              beschreibung: element.data.beschreibung,
              betrag: element.data.betrag
            }
          })
        } else {
          let x: IFixkostenEintrag = {
            id: this.getNextFreeFixkostenEintragId(),
            data: {
              ...element.data
            }
          }
          month.uebernommeneStandardFixkostenEintraege!.push(x)
        }
      } else {
        let x: IFixkostenEintrag = {
          id: this.getNextFreeFixkostenEintragId(),
          data: {
            ...element.data
          }
        }
        month.specialFixkostenEintraege!.push(x);
      }

    })

    this.dataService.userData.months[this.getIndexOfMonthByDate(date)].gesperrteFixKosten = elemente;
    this.dataService.userData.months[this.getIndexOfMonthByDate(date)].uebernommeneStandardFixkostenEintraege = month.uebernommeneStandardFixkostenEintraege;
    this.dataService.update();
  }

  deleteFixkostenEintrag(fixkostenEintragId: number) {
    this.dataService.userData.standardFixkostenEintraege.splice(this.getIndexOfFixkostenEintragById(fixkostenEintragId), 1);
    this.dataService.update();
  }

  addWunschlistenEintrag(wunschlistenEintragData: IWunschlistenEintragData): void {
    const newWunschlistenEintrag: IWunschlistenEintrag = {
      id: this.getNextFreeWunschlistenEintragId(),
      data: wunschlistenEintragData
    };

    this.dataService.userData.wunschlistenEintraege.push(newWunschlistenEintrag);
    this.dataService.update();
  }

  editWunschlistenEintrag(editedWunschlistenEintrag: IWunschlistenEintrag): void {
    this.dataService.userData.wunschlistenEintraege[this.getIndexOfWunschlistenEintragById(editedWunschlistenEintrag.id)] = editedWunschlistenEintrag;
    this.dataService.update();
  }

  deleteWunschlistenEintrag(wunschlistenEintragId: number) {
    const boundSparschweinEintrag = this.dataService.userData.sparschweinEintraege.filter(eintrag => eintrag.data.wunschlistenId === wunschlistenEintragId);
    const index = this.dataService.userData.sparschweinEintraege.indexOf(boundSparschweinEintrag[0]);
    this.dataService.userData.sparschweinEintraege.splice(index, 1);
    this.dataService.userData.wunschlistenEintraege.splice(this.getIndexOfWunschlistenEintragById(wunschlistenEintragId), 1);
    this.dataService.update();
  }

  addSparschweinEintrag(sparschweinEintragData: ISparschweinEintragData): void {
    const newSparschweinEintrag: ISparschweinEintrag = {
      id: this.getNextFreeSparschweinEintragId(),
      data: sparschweinEintragData
    };

    this.dataService.userData.sparschweinEintraege.push(newSparschweinEintrag);
    this.dataService.update();
  }

  editSparschweinEintrag(editedSparschweinEintrag: ISparschweinEintrag): void {
    this.dataService.userData.sparschweinEintraege[this.getIndexOfSparschweinEintragById(editedSparschweinEintrag.id)] = editedSparschweinEintrag;
    this.dataService.update();
  }

  deleteSparschweinEintrag(sparschweinEintragId: number) {
    this.dataService.userData.sparschweinEintraege.splice(this.getIndexOfSparschweinEintragById(sparschweinEintragId), 1);
    this.dataService.update();
  }

  deleteSparschweinEintragByWunschId(wunschId: number) {
    this.dataService.userData.sparschweinEintraege.splice(this.getIndexOfSparschweinEintragByWunschId(wunschId), 1);
    this.dataService.update();
  }

  changeTotalBudgetBetragForMonth(date: Date, editedTotalBudgetBetrag: number) {
    this.dataService.createNewMonthIfNecessary(date);
    this.dataService.userData.months[this.getIndexOfMonthByDate(date)].totalBudget = editedTotalBudgetBetrag;
    this.dataService.update();
  }

  changeSparenBetragForMonth(date: Date, editedSparenBetrag: number) {
    this.dataService.createNewMonthIfNecessary(date);
    this.dataService.userData.months[this.getIndexOfMonthByDate(date)].sparen = editedSparenBetrag;
    this.dataService.update();
  }

  setSettingEnableToHighBuchungen(value: boolean) {
    this.dataService.userData.settings.toHighBuchungenEnabled = value;
    this.dataService.update();
  }

  setTopBarAnzeigeOption(option: number) {
    this.dataService.userData.settings.topBarAnzeigeEinstellung = option;
    this.dataService.update();
  }

  setTagesAnzeigeOption(option: number) {
    this.dataService.userData.settings.tagesAnzeigeOption = option;
    this.dataService.update();
  }

  addBuchungsKategorie(name: string) {
    this.dataService.userData.addKategorie(name);
  }

  deleteAllBuchungsKategorien() {
    this.dataService.userData.buchungsKategorien = [];
  }

  editAuswertungsLayouts(elemente: IAuswertungsLayout[]) {
    this.dataService.userData.auswertungsLayouts = [];
    elemente.forEach(element => {
      if(element.id > 0) {
        this.dataService.userData.auswertungsLayouts.push(element);
      }
    });
    this.dataService.update();
  }


  private getNextFreeBuchungId() {
    let freeId = 1;
    for (let i = 0; i < this.dataService.userData.buchungen.length; i++) {
      if (this.dataService.userData.buchungen.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }


  private getNextFreeGeplanteAusgabenBuchungId() {
    let freeId = 1;
    for (let i = 0; i < this.dataService.userData.geplanteAusgabenBuchungen.length; i++) {
      if (this.dataService.userData.geplanteAusgabenBuchungen.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getNextFreeAuswertungLayoutId() {
    let freeId = 1;
    for (let i = 0; i < this.dataService.userData.auswertungsLayouts.length; i++) {
      if (this.dataService.userData.auswertungsLayouts.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getNextFreeFixkostenEintragId() {
    let freeId = 1;
    const alleEintraege = this.getAlleFixkostenEintraege();
    for (let i = 0; i < alleEintraege.length; i++) {
      if (alleEintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getNextFreeGeplanteAusgabeId() {
    let freeId = 1;
    const alleEintraege = this.getAlleGeplantenAusgaben();
    for (let i = 0; i < alleEintraege.length; i++) {
      if (alleEintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getNextFreeWunschlistenEintragId() {
    let freeId = 1;
    for (let i = 0; i < this.dataService.userData.wunschlistenEintraege.length; i++) {
      if (this.dataService.userData.wunschlistenEintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getNextFreeSparschweinEintragId() {
    let freeId = 1;
    for (let i = 0; i < this.dataService.userData.sparschweinEintraege.length; i++) {
      if (this.dataService.userData.sparschweinEintraege.find(x => x.id === freeId) === undefined) {
        return freeId;
      } else {
        freeId++;
      }
    }
    return freeId;
  }

  private getIndexOfBuchungById(id: number) {
    return this.dataService.userData.buchungen.findIndex(eintrag => eintrag.id === id);
  }

  private getIndexOfGeplanteAusgabenBuchungById(id: number) {
    return this.dataService.userData.geplanteAusgabenBuchungen.findIndex(eintrag => eintrag.id === id);
  }

  private getIndexOfAuswertungsLayoutById(id: number) {
    return this.dataService.userData.auswertungsLayouts.findIndex(eintrag => eintrag.id === id);
  }

  private getIndexOfFixkostenEintragById(id: number) {
    return this.dataService.userData.standardFixkostenEintraege.findIndex(eintrag => eintrag.id === id);
  }

  private getIndexOfWunschlistenEintragById(id: number) {
    return this.dataService.userData.wunschlistenEintraege.findIndex(eintrag => eintrag.id === id);
  }

  private getIndexOfSparschweinEintragById(id: number) {
    return this.dataService.userData.sparschweinEintraege.findIndex(eintrag => eintrag.id === id);
  }

  private getIndexOfSparschweinEintragByWunschId(id: number) {
    return this.dataService.userData.sparschweinEintraege.findIndex(eintrag => eintrag.data.wunschlistenId === id);
  }

  private getIndexOfMonthByDate(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.dataService.userData.months.findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }

  private getAlleFixkostenEintraege(): IFixkostenEintrag[] {
    let eintraege = this.dataService.userData.standardFixkostenEintraege ?? [];
    this.dataService.userData.months.forEach(month => {
      eintraege = eintraege.concat(month.specialFixkostenEintraege ? month.specialFixkostenEintraege : []);
    })
    return eintraege;
  }

  private getAlleGeplantenAusgaben(): IGeplanteAusgabe[] {
    let eintraege: IGeplanteAusgabe[] = [];
    this.dataService.userData.months.forEach(month => {
      eintraege = eintraege.concat(month.geplanteAusgaben ? month.geplanteAusgaben : []);
    })
    return eintraege;
  }
}
