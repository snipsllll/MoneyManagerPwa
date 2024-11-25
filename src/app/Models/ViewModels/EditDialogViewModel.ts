export interface EditDialogViewModel {
  data: EditDialogData;
  onSaveClick: (editDialogData: EditDialogData) => void;
  onCancelClick: () => void;
  istVonHeuteAbzeihenVisible?: boolean;
  isBetragAusgeblendet?: boolean;
  isZusatzAusgeblendet?: boolean;
}

export interface EditDialogData {
  title?: string;
  betrag?: number;
  zusatz?: string;
  id: number;
  date?: Date;
  erstelltAm?: Date;
  vonHeuteAbziehen?: boolean;
}
