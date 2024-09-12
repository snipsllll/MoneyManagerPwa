import {Buchungen} from "./Buchungen";
import {Buchung, FixKostenEintrag, Month} from "./ClassesInterfacesEnums";
import {signal} from "@angular/core";

export class UserData {

  public buchungen: Buchungen = new Buchungen();
  public months= signal<Month[]>([]);
  public fixKosten: FixKostenEintrag[] = [];

  constructor(buchungen?: Buchung[]) {
    if(buchungen){
      this.buchungen = new Buchungen(buchungen);
    }
  }
}
