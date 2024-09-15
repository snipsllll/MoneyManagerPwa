import { Injectable } from '@angular/core';
import {DataService} from "../DataService/data.service";
import {SparschweinData, SparschweinEintrag} from "../../Models/Interfaces";

@Injectable({
  providedIn: 'root'
})
export class SparschweinService {

  constructor(private dataService: DataService) { }

  getData(): SparschweinData {
    let eintraege = this.dataService.userData.sparEintraege;
    let allEintraege: SparschweinEintrag[] = [];

    this.dataService.userData.wunschlistenEintraege.forEach(wEintrag => {
      if(wEintrag.gekauft === true) {
        const x: SparschweinEintrag = {
          betrag: wEintrag.betrag * -1,
          date: wEintrag.date,
          id: -1,
          zusatz: wEintrag.zusatz,
          title: wEintrag.title,
          isWunschlistenEintrag: true
        }
        allEintraege.push(x);
      }
    })

    eintraege.forEach(eintrag => {
      allEintraege.push(eintrag);
    })

    return {
      eintraege: allEintraege,
      erspartes: this.dataService.getErspartes()
    };
  }

  getEintraege(): SparschweinEintrag[] {
    return [];
  }

  addEintrag(eintrag: SparschweinEintrag) {
    this.dataService.addSparEintrag(eintrag);
  }

  editEintrag(eintrag: SparschweinEintrag) {
    this.dataService.editSparEintrag(eintrag);
  }

  deleteEintrag(eintragId: number) {
    this.dataService.deleteSparEintrag(eintragId);
  }
}
