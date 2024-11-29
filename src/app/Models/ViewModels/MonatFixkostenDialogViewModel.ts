import {IFixkostenEintrag, IMonthFixkostenEintrag} from "../NewInterfaces";

export interface MonatFixkostenDialogViewModel {
  elemente: IMonthFixkostenEintrag[];
  onSaveClicked: (monatFixkostenDialogdata: MonatFixkostenDialogData) => void;
  onAbortClicked: () => void;
  summeLabel: string;
}

export interface MonatFixkostenDialogData {
  elemente: IMonthFixkostenEintrag[];
}
