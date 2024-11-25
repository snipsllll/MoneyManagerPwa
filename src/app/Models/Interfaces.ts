import {
  IBuchung,
  IFixkostenEintrag,
  IMonthFixkostenEintrag,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "./NewInterfaces";
import {TagesAnzeigeOptions, TopBarBudgetOptions} from "./Enums";

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
}

export interface SavedData {
  buchungen: IBuchung[];
  buchungsKategorien: { id: number; name: string }[];
  savedMonths: SavedMonth[];
  standardFixkostenEintraege: IFixkostenEintrag[];
  sparEintraege: ISparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  settings: Settings;
  dbVersion: number;
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
  uebernommeneStandardFixkostenEintraege?: IMonthFixkostenEintrag[];
  specialFixkostenEintraege?: IMonthFixkostenEintrag[];
}

export interface MenuItem {
  label: string;
  onClick: (input?: any) => void;
  grayedOut?: boolean;
}

export interface AvailableMoney {
  availableForMonth: number;
  availableForWeek: number;
  availableForDay: number;
  noData: boolean;
}
