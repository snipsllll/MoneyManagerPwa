import { Injectable } from '@angular/core';
import {DataService} from "../DataService/data.service";
import {SparschweinData, SparschweinEintrag} from "../../Models/Interfaces";
import {SaveService} from "../SaveService/save.service";

@Injectable({
  providedIn: 'root'
})
export class SparschweinService {

  constructor(private dataService: DataService, private saveService: SaveService) { }

  getData(): SparschweinData {
    let sparschweinEintraege = this.saveService.getSparEintraege();
    let gekaufteWunschlistenEintraege = this.saveService.getWunschlistenEintraege().filter(x => x.gekauft === true);
    let spareintraegeVonWunschliste: SparschweinEintrag[] = [];

    gekaufteWunschlistenEintraege.forEach(wEintrag => {
      const x: SparschweinEintrag = {
        betrag: wEintrag.betrag * -1,
        date: wEintrag.date,
        id: -1,
        zusatz: wEintrag.zusatz,
        title: wEintrag.title,
        isWunschlistenEintrag: true
      }
      spareintraegeVonWunschliste.push(x);
    })

    let alleEintraege = sparschweinEintraege.concat(spareintraegeVonWunschliste)

    let ersparnisse = 0;
    alleEintraege.forEach(eintrag => {
      ersparnisse += eintrag.betrag;
    })

    return {
      eintraege: alleEintraege,
      erspartes: ersparnisse
    };
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
