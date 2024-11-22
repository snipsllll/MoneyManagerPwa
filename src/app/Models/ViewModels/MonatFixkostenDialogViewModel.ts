import {IFixkostenEintrag} from "../NewInterfaces";

export interface MonatFixkostenDialogViewModel {
  elemente: IFixkostenEintrag[];
  onSaveClicked: (monatFixkostenDialogdata: MonatFixkostenDialogData) => void;
  onAbortClicked: () => void;
}

export interface MonatFixkostenDialogData {
  elemente: IFixkostenEintrag[];
}
