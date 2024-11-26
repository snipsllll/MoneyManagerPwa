import {BarChartFilterOptions, BarChartValueOptions, Months, XAchsenSkalierungsOptionen} from "./Enums";

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
  zusatz?: string;
  isExcluded?: boolean;
  isStandardFixkostenEintrag?: boolean;
}

export interface IFixkostenEintragData {
  title: string;
  betrag: number;
  zusatz?: string;
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

export interface BarChartViewModel {
  labels: string[]; // Labels für die x-Achse (z. B. Monate)
  datasets: {        // Datensätze mit Werten und Farben
    label: string;   // Name des Datensatzes (z. B. "Umsatz" oder "Gewinn")
    data: number[];  // Werte für jeden Balken in der Kategorie
    backgroundColor: string; // Farbe für die Balken dieses Datensatzes
  }[];
}

export interface IAuswertungsLayout {
  id: number;
  data: IAuswertungsLayoutData;
}

export interface IAuswertungsLayoutData {
  titel: string;
  diagramme: IDiagrammData[];
}

export interface IDiagrammData {
  title: string;
  xAchsenSkalierung: XAchsenSkalierungsOptionen;
  valueOption: BarChartValueOptions;
  filter: {filter: BarChartFilterOptions, value: any}[];

}
