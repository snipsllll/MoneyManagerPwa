import {ListElementData} from "./ViewModels/ListElementViewModel";

export interface AuswertungenDialogViewModel {
  elemente: IAuswertungsLayout[];
  onSaveClicked: (data: IAuswertungsLayout[]) => void;
  onAbortClicked: () => void;
}

export interface ZahlungDialogViewModel {
  zuZahlenderBetrag: number;
  eingegebenerBetrag?: number;
  onSaveClicked: (data: ListElementData) => void;
  onAbortClicked: (data: ListElementData) => void;
  eintrag: ListElementData;
}

export interface IAuswertungsLayout {
  id: number;
  data: IAuswertungsLayoutData;
}

export interface IAuswertungsLayoutData {
  layoutTitle: string;
  diagramme: IDiagramm[];
}

export interface IDiagramm {
  id: number;
  data: IDiagrammData;
}

export interface IDiagrammData {
  selectedDiagramType: string;
  diagramTitle: string;
  balkenBeschriftung: string;
  xAchse: string;
  yAchse: string;
  balkenColor?: string;
  filterOption?: {
    filter: string;
    value: any
  };
  lineOption?: {
    lineType: string;
    lineValue?: number;
  };
}
