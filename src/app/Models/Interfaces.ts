import {IBuchung, IFixkostenEintrag, ISparschweinEintrag, IWunschlistenEintrag} from "./NewInterfaces";

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

export interface DayIstBudgets {
  monthIstBudget?: number;
  weekIstBudget?: number;
  dayIstBudget?: number;
  gespartes?: number;
}

export interface BudgetInfosForMonth {
  totalBudget: number;
  sparen: number;
  budget: number;
  dayBudget: number;
  istBudget?: number;
  fixKostenSumme?: number;
  fixKostenEintraege?: IFixkostenEintrag[];
  fixKostenGesperrt?: boolean;
}

export interface SavedData {
  buchungen: IBuchung[];
  savedMonths: SavedMonth[];
  fixKosten: IFixkostenEintrag[];
  sparEintraege: ISparschweinEintrag[];
  wunschlistenEintraege: IWunschlistenEintrag[];
  settings: Settings;
}

export interface Settings {
  wunschllistenFilter: WunschlistenFilter;
  showDayDifferenceInHome: boolean;
  toHighBuchungenEnabled?: boolean;
}

export interface WunschlistenFilter {
  gekaufteEintraegeAusblenden: boolean;
  selectedFilter: string;
}

export interface SavedMonth {
  date: Date;
  totalBudget: number;
  sparen: number;
  fixkosten?: IFixkostenEintrag[];
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
}
