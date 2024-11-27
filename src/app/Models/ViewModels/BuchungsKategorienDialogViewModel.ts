

export interface BuchungsKategorienDialogViewModel {
  elemente: { id: number, name: string }[];
  onSaveClicked: (data: { id: number, name: string }[]) => void;
  onAbortClicked: () => void;
}
