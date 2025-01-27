import {FixkostenPeriods} from "../Enums";

export interface CreateDialogViewModel {
  onSaveClick: (createDialogEintrag: CreateDialogEintrag) => void;
  onCancelClick: () => void;
  istVonHeuteAbzeihenVisible?: boolean;
  isBetragAusgeblendet?: boolean;
  isBeschreibungAusgeblendet?: boolean;
  isPeriodVisible?: boolean;
}

export interface CreateDialogEintrag {
  title?: string;
  betrag?: number;
  beschreibung?: string;
  vonHeuteAbziehen?: boolean;
  period?: FixkostenPeriods;
}
