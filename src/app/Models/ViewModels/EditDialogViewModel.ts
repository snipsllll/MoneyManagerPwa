export interface EditDialogViewModel {
  data: EditDialogData;
  onSaveClick: (editDialogData: EditDialogData) => void;
  onCancelClick: () => void;
  istVonHeuteAbzeihenVisible?: boolean;
}

export interface EditDialogData {
  title?: string;
  betrag: number;
  zusatz?: string;
  id?: number;
  date?: Date;
  erstelltAm?: Date;
  vonHeuteAbziehen?: boolean;
}
