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
  leftOvers?: number;
}

export interface Week {
  startDate: Date;
  endDate: Date;
  daysInWeek: number;
  budget?: number;
  istBudget?: number;
  days: Day[];
  leftOvers?: number;
}

export interface Day {
  date: Date;
  budget?: number;
  istBudget?: number;
  buchungen?: Buchung[];
  leftOvers?: number;
}

export interface Buchung {
  id?: number
  title: string
  betrag: number | null
  beschreibung?: string
  date: Date;
  time: string;
}

export interface ItfUserData {
  buchungen?: Buchung[],
  months: Month[]
}

export interface DayIstBudgets {
  monthIstBudget?: number;
  weekIstBudget?: number;
  dayIstBudget?: number;
}

export interface BudgetInfosForMonth {
  totalBudget: number;
  sparen: number;
  budget: number;
  dayBudget: number;
  istBudget?: number;
  fixKosten?: number;
}

export interface SavedData {
  buchungen: Buchung[];
  savedMonths: SavedMonth[];
  fixKosten: FixKostenEintrag[];
}

export interface SavedMonth {
  date: Date;
  totalBudget: number;
  sparen: number;
}

export interface FixKostenEintrag {
  id?: number;
  betrag: number;
  title: string;
  beschreibung?: string;
  periode?: null; //TODO Noch machen
}

export interface UpdateValues {
  months?: UpdateValuesForMonth[];
  newFixkostenEintraege?: FixKostenEintrag[];
  deletedFixkostenEintreageIds?: number[];
  editedFixKostenEintraege?: FixKostenEintrag[];
  newBuchungen?: Buchung[];
  deletedBuchungsIds?: number[];
  editedBuchungen?: Buchung[];
}

export interface UpdateValuesForMonth {
  date: Date;
  newSparen?: number;
  newTotalBudget?: number;
  newMaxDayBudget?: number;
}

export enum Months {
  Januar,
  Februar,
  Maerz,
  April,
  Mai,
  Juni,
  Juli,
  August,
  September,
  Oktober,
  Novermber,
  Dezember
}

export enum SideNavElements {
  home,
  budget,
  fixkosten
}

export enum Sites {
  home,
  budget,
  createBuchung,
  editBuchung,
  buchungDetails,
  fixKosten
}
