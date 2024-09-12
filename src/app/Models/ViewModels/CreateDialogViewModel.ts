export interface CreateDialogViewModel {
  onSaveClick: () => void;
  onCancelClick: () => void;
}

export interface CreateDialogEintrag {
  title?: string;
  betrag: number;
  zusatz?: string;
}
