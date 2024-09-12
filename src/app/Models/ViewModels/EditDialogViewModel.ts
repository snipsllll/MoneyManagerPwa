export interface EditDialogViewModel {
  data: EditDialogData;
  onSaveClick: (editDialogData: EditDialogData) => void;
  onCancelClick: () => void;
}

export interface EditDialogData {
  title?: string;
  betrag: number;
  zusatz?: string;
  id?: number;
}
