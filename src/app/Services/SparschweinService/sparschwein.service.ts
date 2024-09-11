import { Injectable } from '@angular/core';
import {SparschweinData, SparschweinEintrag} from "../../Models/ClassesInterfacesEnums";
import {DataService} from "../DataService/data.service";

@Injectable({
  providedIn: 'root'
})
export class SparschweinService {

  constructor(private dataService: DataService) { }

  getData(): SparschweinData {
    return {
      eintraege: this.dataService.getSparEintraege(),
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
