import {
  IBuchung, IFireBuchung, IFireSparschweinEintrag,
  IFixkostenEintrag, IGeplanteAusgabenKategorie,
  IMonthFixkostenEintrag,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "./NewInterfaces";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "./Enums";
import {IAuswertungsLayout} from "./Auswertungen-Interfaces";
import {Timestamp} from "rxjs";
import {Time} from "@angular/common";

// Das Month-Interface bleibt unverändert, da es keine Abhängigkeit von Firestore hat
export interface Month {
  totalBudget?: number;
  sparen?: number;
  startDate: Date;
  endDate?: Date;
  daysInMonth?: number;
  budget?: number;
  istBudget?: number;
  dailyBudget?: number;
  weeks?: Week[];
  gesperrteFixKosten?: IFixkostenEintrag[];
  monatAbgeschlossen?: boolean;
  uebernommeneStandardFixkostenEintraege?: IMonthFixkostenEintrag[];
  specialFixkostenEintraege?: IMonthFixkostenEintrag[];
  geplanteAusgaben?: IGeplanteAusgabe[];
}

export interface Week {
  startDate: Date;
  endDate: Date;
  daysInWeek: number;
  budget?: number;
  istBudget?: number;
  days: Day[];
}

export interface Day {
  date: Date;
  budget?: number;
  istBudget?: number;
  buchungen?: IBuchung[];
  geplanteAusgabenBuchungen?: IGeplanteAusgabenBuchung[];
}

export interface BudgetInfosForMonth {
  totalBudget: number;
  sparen: number;
  budget: number;
  dayBudget: number;
  istBudget?: number;
  fixKostenSumme?: number;
  fixKostenEintraege?: IMonthFixkostenEintrag[];
  fixKostenGesperrt?: boolean;
  geplanteAusgabenSumme?: number;
  geplanteAusgaben?: IGeplanteAusgabe[];
  geplanteAusgabenRestgeld?: number;
  geplanteAusgabenKategorienRestgeld?: IGeplanteAusgabeRestgeld[];
}

export interface SavedData {
  buchungen: IBuchung[];
  buchungsKategorien: { id: number; name: string }[];
  savedMonths: SavedMonth[];
  standardFixkostenEintraege: IFixkostenEintrag[];
  sparEintraege: ISparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  auswertungsLayouts: IAuswertungsLayout[];
  settings: Settings;
  dbVersion: number;
  geplanteAusgabenBuchungen: IGeplanteAusgabenBuchung[];
}

export interface FireData {
  buchungen: IFireBuchung[];
  buchungsKategorien: { id: number; name: string }[];
  savedMonths: FireMonth[];
  standardFixkostenEintraege: IFixkostenEintrag[];
  sparEintraege: IFireSparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  auswertungsLayouts: IAuswertungsLayout[];
  settings: Settings;
  dbVersion: number;
  geplanteAusgabenBuchungen: IGeplanteAusgabenBuchung[];
}

export interface IGeplanteAusgabenBuchung {
  id: number;
  data: IGeplanteAusgabenBuchungData;
}

export interface IGeplanteAusgabenBuchungData {
  date: Date;
  time: string;
  title: string;
  betrag: number | null;
  beschreibung?: string;
  buchungsKategorie?: number;
}

export interface IFireGeplanteAusgabenBuchung {
  id: number;
  data: IFireGeplanteAusgabenBuchungData;
}

export interface IFireGeplanteAusgabenBuchungData {
  date: any;
  time: string;
  title: string;
  betrag: number | null;
  beschreibung?: string;
  buchungsKategorie?: number;
}

export interface Settings {
  wunschlistenFilter: WunschlistenFilter;
  toHighBuchungenEnabled: boolean;
  topBarAnzeigeEinstellung?: TopBarBudgetOptions;
  tagesAnzeigeOption?: TagesAnzeigeOptions;
}

export interface WunschlistenFilter {
  gekaufteEintraegeAusblenden: boolean;
  selectedFilter: string;
}

export interface SavedMonth {
  date: Date;
  totalBudget: number;
  sparen: number;
  geplanteAusgaben?: IGeplanteAusgabe[];
  uebernommeneStandardFixkostenEintraege?: IMonthFixkostenEintrag[];
  specialFixkostenEintraege?: IMonthFixkostenEintrag[];
}

export interface FireMonth {
  // Hier bleibt der Timestamp-Typ erhalten, aber wir können ihn später in ein Date umwandeln
  date: any;
  totalBudget: number;
  sparen: number;
  geplanteAusgaben?: IGeplanteAusgabe[];
  uebernommeneStandardFixkostenEintraege?: IMonthFixkostenEintrag[];
  specialFixkostenEintraege?: IMonthFixkostenEintrag[];
}

export interface SaveDataUpdateInfos {
  isInitialLoad?: boolean;
  fireData: FireData;
}

export interface IGeplanteAusgabe {
  id: number;
  data: IGeplanteAusgabeData;
}

export interface IGeplanteAusgabeData {
  title: string;
  betrag: number;
  beschreibung?: string;
}

export interface IGeplanteAusgabeRestgeld {
  id: number;
  title: string;
  restgeldBetrag: number;
}

export interface MenuItem {
  label: string;
  onClick: (input?: any) => void;
  grayedOut?: boolean;
  isEditButton?: boolean;
}

export interface AvailableMoney {
  availableForMonth: number;
  availableForWeek: number;
  availableForDayIst: number;
  availableForDaySoll: number;
  noData: boolean;
}
