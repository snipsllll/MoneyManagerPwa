import {Buchungen} from "./Buchungen";
import {Buchung, FixKostenEintrag, Month, SparschweinEintrag} from "./ClassesInterfacesEnums";
import {signal} from "@angular/core";

export class UserData {

  public buchungen: Buchungen = new Buchungen();
  public months= signal<Month[]>([]);
  public fixKosten: FixKostenEintrag[] = [];
  public sparEintraege: SparschweinEintrag[] = [];

  constructor(buchungen?: Buchung[]) {
    if(buchungen){
      this.buchungen = new Buchungen(buchungen);
    }
  }
}
