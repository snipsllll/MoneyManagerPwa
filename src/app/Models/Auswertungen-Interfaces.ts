export interface NewAuswertungenDialogViewModel {
  elemente: NewIAuswertungsLayout[];
  onSaveClicked: (data: NewIAuswertungsLayout[]) => void;
  onAbortClicked: () => void;
}

export interface NewIAuswertungsLayout {
  id: number;
  data: NewIAuswertungsLayoutData;
}

export interface NewIAuswertungsLayoutData {
  layoutTitle: string;
  diagramme: NewIDiagramm[];
}

export interface NewIDiagramm {
  id: number;
  data: NewIDiagrammData;
}

export interface NewIDiagrammData {
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
