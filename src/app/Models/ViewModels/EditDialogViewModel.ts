export interface EditDialogViewModel {
  data: EditDialogData;
}

export interface EditDialogData {
  title?: string;
  betrag: number;
  zusatz?: string;
  id?: number;
  onSaveClick: () => void;
  onCancelClick: () => void;
}
