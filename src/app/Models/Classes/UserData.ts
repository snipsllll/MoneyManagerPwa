import {Buchungen} from "./Buchungen";
import {signal} from "@angular/core";
import {Buchung, FixKostenEintrag, Month, SparschweinEintrag, WunschlistenEintrag} from "../Interfaces";

export class UserData {

  public buchungen: Buchungen = new Buchungen();
  public months= signal<Month[]>([]);
  public fixKosten: FixKostenEintrag[] = [];
  public sparEintraege: SparschweinEintrag[] = [];
  public wunschlistenEintraege: WunschlistenEintrag[] = [];

  constructor(buchungen?: Buchung[]) {
    if(buchungen){
      this.buchungen = new Buchungen(buchungen);
    }
  }
}
