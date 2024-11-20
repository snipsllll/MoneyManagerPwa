import { Injectable } from '@angular/core';
import {
  IBuchung,
  IBuchungData,
  IFixkostenEintrag,
  IFixkostenEintragData, IMonth, ISparschweinEintrag, ISparschweinEintragData,
  IWunschlistenEintrag, IWunschlistenEintragData
} from "../../Models/NewInterfaces";

@Injectable({
  providedIn: 'root'
})
export class DataChangeService {

  constructor() { }

  addBuchung(buchungData: IBuchungData): void {

  }

  editBuchung(editedBuchung: IBuchung): void {

  }

  deleteBuchung(buchungId: number) {

  }

  addFixkostenEintrag(fixkostenEintragData: IFixkostenEintragData): void {

  }

  editFixkostenEintrag(editedFixkostenEintrag: IFixkostenEintrag): void {

  }

  deleteFixkostenEintrag(fixkostenEintragId: number) {

  }

  addWunschlistenEintrag(wunschlistenEintragData: IWunschlistenEintragData): void {

  }

  editWunschlistenEintrag(editedWunschlistenEintrag: IWunschlistenEintrag): void {

  }

  deleteWunschlistenEintrag(wunschlistenEintragId: number) {

  }

  addSparschweinEintrag(sparschweinEintragData: ISparschweinEintragData): void {

  }

  editSparschweinEintrag(editedSparschweinEintrag: ISparschweinEintrag): void {

  }

  deleteSparschweinEintrag(sparschweinEintragId: number) {

  }

  changeTotalBudgetBetragForMonth(month: IMonth, editedTotalBudgetBetrag: number) {

  }

  changeSparenBetragForMonth(month: IMonth, editedSparenBetrag: number) {

  }
}
