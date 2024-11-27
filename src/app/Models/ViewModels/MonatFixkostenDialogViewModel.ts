import {IFixkostenEintrag, IMonthFixkostenEintrag} from "../NewInterfaces";

export interface MonatFixkostenDialogViewModel {
  elemente: IMonthFixkostenEintrag[];
  onSaveClicked: (monatFixkostenDialogdata: MonatFixkostenDialogData) => void;
  onAbortClicked: () => void;
}

export interface MonatFixkostenDialogData {
  elemente: IMonthFixkostenEintrag[];
}
