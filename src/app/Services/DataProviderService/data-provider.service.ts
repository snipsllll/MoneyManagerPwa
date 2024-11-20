import { Injectable } from '@angular/core';
import {
  IBuchung,
  IDay,
  IFixkostenEintrag,
  IMonth,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "../../Models/NewInterfaces";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  constructor() { }

  getUnspendMoneyForMonth(month: IMonth): number | undefined {
    return undefined;
  }

  getAlleBuchungen(): IBuchung[] {
    return [];
  }

  getAlleBuchungenForMonth(month: IMonth): IBuchung[] {
    return [];
  }

  getAlleBuchungenForDay(day: IDay): IBuchung[] {
    return [];
  }

  getAlleFixkostenEintraegeForMonth(month: IMonth): IFixkostenEintrag[] {
    return [];
  }

  getAlleWunschlistenEintraege(): IWunschlistenEintrag[] {
    return [];
  }

  getAlleSparschweinEintraege(): ISparschweinEintrag[] {
    return [];
  }

  getAusgabenBetragForDay(day: IDay): number | undefined {
    return undefined;
  }
}
