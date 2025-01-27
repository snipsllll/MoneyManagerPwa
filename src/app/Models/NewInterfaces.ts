import {FixkostenPeriods, Months, AbrechnungsMonate, TopBarBudgetOptions} from "./Enums";
import {Day, IGeplanteAusgabenBuchung, Month, Settings} from "./Interfaces";
import {IAuswertungsLayout} from "./Auswertungen-Interfaces";

export interface IMonth {
  month: Months;
  year: number;
}

export interface IDay {
  date: Date;
}

export interface IBuchung {
  id: number;
  data: IBuchungData;
}

export interface IBuchungData {
  date: Date;
  time: string;
  title: string
  betrag: number | null
  beschreibung?: string
  buchungsKategorie?: number;
  geplanteBuchung?: boolean;
}

export interface IFireBuchung {
  id: number;
  data: IFireBuchungData;
}

export interface IFireBuchungData {
  date: any;
  time: string;
  title: string
  betrag: number | null
  beschreibung?: string
  buchungsKategorie?: number;
  geplanteBuchung?: boolean;
}

export interface IMonthFixkostenEintrag {
  id: number;
  data: IMonthFixkostenEintragData;
}

export interface IFixkostenEintrag {
  id: number;
  data: IFixkostenEintragData;
}

export interface IMonthFixkostenEintragData {
  title: string;
  betrag: number;
  period: FixkostenPeriods;
  beschreibung?: string;
  isExcluded?: boolean;
  isStandardFixkostenEintrag?: boolean;
}

export interface IFixkostenEintragData {
  title: string;
  betrag: number;
  period: FixkostenPeriods;
  beschreibung?: string;
  abrechnungsmonat?: AbrechnungsMonate;
}

export interface IWunschlistenEintrag {
  id: number;
  data: IWunschlistenEintragData;
}

export interface IWunschlistenEintragData {
  date: Date;
  title: string;
  betrag: number;
  zusatz?: string;
  gekauft: boolean;
  gekauftAm?: Date;
  erstelltAm: Date;
}

export interface ISparschweinEintrag {
  id: number;
  data: ISparschweinEintragData;
}

export interface ISparschweinEintragData {
  date: Date;
  title?: string;
  betrag: number;
  zusatz?: string;
  vonWunschliste?: boolean;
  wunschlistenId?: number;
  vonMonat?: boolean;
}

export interface IFireSparschweinEintrag {
  id: number;
  data: IFireSparschweinEintragData;
}

export interface IFireSparschweinEintragData {
  date: any;
  title?: string;
  betrag: number;
  zusatz?: string;
  vonWunschliste?: boolean;
  wunschlistenId?: number;
  vonMonat?: boolean;
}

export interface BarChartViewModel {
  diagramLabel: string;
  labels: string[]; // Labels für die x-Achse (z. B. Monate)
  datasets: {        // Datensätze mit Werten und Farben
    label: string;   // Name des Datensatzes (z. B. "Umsatz" oder "Gewinn")
    data: number[];  // Werte für jeden Balken in der Kategorie
    backgroundColor: string; // Farbe für die Balken dieses Datensatzes
    horizontaleLinie?: number; // Wert für die horizontale Linie
    showHorizontaleLinie?: boolean; // Ob die Linie angezeigt werden soll
  }[];
}

export interface IGeplanteAusgabenKategorie {
  id: number;
  title: string;
  betrag: number;
}

export interface IBuchungenlistMonth {
  monthName: string;
  days: Day[];
  isVisible: boolean;
  isGeplantMonth: boolean;
}

export interface IUserData {
  buchungen: IBuchung[];
  buchungsKategorien: { id: number; name: string }[];
  months: Month[];
  standardFixkostenEintraege: IFixkostenEintrag[];
  sparschweinEintraege: ISparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  auswertungsLayouts: IAuswertungsLayout[];
  geplanteAusgabenBuchungen: IGeplanteAusgabenBuchung[];
  settings: Settings;
}
