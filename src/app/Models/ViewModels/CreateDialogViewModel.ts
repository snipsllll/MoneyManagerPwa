export interface CreateDialogViewModel {
  onSaveClick: (createDialogEintrag: CreateDialogEintrag) => void;
  onCancelClick: () => void;
}

export interface CreateDialogEintrag {
  title?: string;
  betrag?: number;
  zusatz?: string;
}
