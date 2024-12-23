import {ISchuldenEintrag} from "../Interfaces";

export interface SchuldenPlanenDialogViewModel {
  schuldentitle: string;
  schuldenbetrag: number;
  schuldenPlanEintraege: ISchuldenPlanEintrag[];
  onSaveClicked: (schuldenPlanEintraege: ISchuldenPlanEintrag[]) => void;
  onAbortClicked: () => void;
}

export interface ISchuldenPlanEintrag {
  id: number;
  data: ISchuldenPlanEintragData;
}

export interface ISchuldenPlanEintragData {
  monatStartDate: Date;
  betrag: number;
}
