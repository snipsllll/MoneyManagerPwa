export interface CreateDialogViewModel {
  onSaveClick: (createDialogEintrag: CreateDialogEintrag) => void;
  onCancelClick: () => void;
  istVonHeuteAbzeihenVisible?: boolean;
}

export interface CreateDialogEintrag {
  title?: string;
  betrag?: number;
  zusatz?: string;
  vonHeuteAbziehen?: boolean;
}
