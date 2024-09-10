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
      erspartes: 1000,
      eintraege: [
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1,
          monat: {
            startDate: new Date()
          }
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        },
        {
          date: new Date(),
          betrag: 10,
          id: 1
        }
      ]
    }
  }

  getEintraege(): SparschweinEintrag[] {
    return [];
  }

  addEintrag(eintrag: SparschweinEintrag) {

  }

  editEintrag(eintrag: SparschweinEintrag) {

  }

  deleteEintrag(eintragId: number) {

  }
}
