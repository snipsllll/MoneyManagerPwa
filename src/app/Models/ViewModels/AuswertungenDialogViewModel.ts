import {IAuswertungsLayout} from "../NewInterfaces";

export interface AuswertungenDialogViewModel {
  elemente: IAuswertungsLayout[];
  onSaveClicked: (data: IAuswertungsLayout[]) => void;
  onAbortClicked: () => void;
}
