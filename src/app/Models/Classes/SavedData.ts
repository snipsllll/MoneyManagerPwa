import {IBuchung, IFixkostenEintrag, ISparschweinEintrag, IWunschlistenEintrag} from "../NewInterfaces";
import {SavedMonth, Settings, WunschlistenFilter} from "../Interfaces";

export interface SavedData1 {
  buchungen: IBuchung[];
  savedMonths: SavedMonth[];
  fixKosten: IFixkostenEintrag[];
  sparEintraege: ISparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  settings: Settings1;
  dbVersion: number;
}

export interface Settings1 {
  wunschllistenFilter: WunschlistenFilter;
  showDaySpend: boolean;
  toHighBuchungenEnabled: boolean;
  x?: boolean;
}

export interface SavedData2 {
  buchungen: IBuchung[];
  savedMonths: SavedMonth[];
  fixKosten: IFixkostenEintrag[];
  sparEintraege: ISparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  settings: Settings2;
  dbVersion: number;
}

export interface Settings2 {
  wunschllistenFilter: WunschlistenFilter;
  showDaySpend: boolean;
  toHighBuchungenEnabled: boolean;
  x?: boolean;
  y?: number;
}
