import { Injectable } from '@angular/core';
import {
  IBuchung,
  IBuchungData,
  IFixkostenEintrag,
  IFixkostenEintragData, IMonthFixkostenEintrag, ISparschweinEintrag, ISparschweinEintragData,
  IWunschlistenEintrag, IWunschlistenEintragData
} from "../../Models/NewInterfaces";
import {DataService} from "../DataService/data.service";

@Injectable({
  providedIn: 'root'
})
export class DataChangeService {

  constructor(private dataService: DataService) { }

  addBuchung(buchungData: IBuchungData): void {
    const newBuchung: IBuchung = {
      id: this.getNextFreeBuchungId(),
      data: buchungData
    };

    this.dataService.userData.buchungen.push(newBuchung);
    this.dataService.update();
  }

  editBuchung(editedBuchung: IBuchung): void {
    this.dataService.userData.buchungen[this.getIndexOfBuchungById(editedBuchung.id)] = editedBuchung;
    this.dataService.update();
  }

  deleteBuchung(buchungId: number) {
    this.dataService.userData.buchungen.splice(this.getIndexOfBuchungById(buchungId), 1);
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

  editFixkostenEintraegeForMonth(date: Date, elemente: IMonthFixkostenEintrag[]) {
    console.log(elemente)
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
              zusatz: element.data.zusatz,
              betrag: element.data.betrag
            }
          })
        } else {
          month.uebernommeneStandardFixkostenEintraege!.push(element)
        }
      } else {
        month.specialFixkostenEintraege!.push(element);
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

  deleteBuchungsKategorie(id: number) {
    this.dataService.userData.removeKategorie(id);
  }

  editBuchungsKategorie(id: number, name: string) {
    this.dataService.userData.editKategorie(id, name);
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

  private getAlleFixkostenEintraegeIds(): number[] {
    let eintraege = this.dataService.userData.standardFixkostenEintraege.map(obj => obj.id) ?? [];
    this.dataService.userData.months.forEach(month => {
      eintraege = eintraege.concat(month.specialFixkostenEintraege ? month.specialFixkostenEintraege.map(obj => obj.id) : []);
    })
    return eintraege;
  }

  private getAlleFixkostenEintraege(): IFixkostenEintrag[] {
    let eintraege = this.dataService.userData.standardFixkostenEintraege ?? [];
    this.dataService.userData.months.forEach(month => {
      eintraege = eintraege.concat(month.specialFixkostenEintraege ? month.specialFixkostenEintraege : []);
    })
    return eintraege;
  }


  //erstmal irrelevant
  private getIndexOfMonthSpareintrag(date: Date) {
    return this.dataService.userData.sparschweinEintraege.findIndex(eintrag => eintrag.data.date.toLocaleDateString() === date.toLocaleDateString());
  }
}
