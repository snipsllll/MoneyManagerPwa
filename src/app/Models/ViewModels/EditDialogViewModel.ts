import {FixkostenPeriods, AbrechnungsMonate} from "../Enums";

export interface EditDialogViewModel {
  data: EditDialogData;
  onSaveClick: (editDialogData: EditDialogData) => void;
  onCancelClick: () => void;
  istVonHeuteAbzeihenVisible?: boolean;
  isBetragAusgeblendet?: boolean;
  isZusatzAusgeblendet?: boolean;
  isPeriodVisible?: boolean;
}

export interface EditDialogData {
  title?: string;
  betrag?: number;
  zusatz?: string;
  id: number;
  date?: Date;
  erstelltAm?: Date;
  vonHeuteAbziehen?: boolean;
  period?: FixkostenPeriods;
  abrechnungsmonat?: AbrechnungsMonate;
}
