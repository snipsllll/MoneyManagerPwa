export interface CreateDialogViewModel {
  onSaveClick: (createDialogEintrag: CreateDialogEintrag) => void;
  onCancelClick: () => void;
  istVonHeuteAbzeihenVisible?: boolean;
  isBetragAusgeblendet?: boolean;
  isBeschreibungAusgeblendet?: boolean;
}

export interface CreateDialogEintrag {
  title?: string;
  betrag?: number;
  beschreibung?: string;
  vonHeuteAbziehen?: boolean;
  date?: Date;
}
