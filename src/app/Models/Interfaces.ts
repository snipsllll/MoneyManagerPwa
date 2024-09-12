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
  gesperrteFixKosten?: FixKostenEintrag[];
  monatAbgeschlossen?: boolean;
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
  leftOvers?: number,
  gespartes?: number
}

export interface BudgetInfosForMonth {
  totalBudget: number;
  sparen: number;
  budget: number;
  dayBudget: number;
  istBudget?: number;
  fixKostenSumme?: number;
  fixKostenEintraege?: FixKostenEintrag[];
  fixKostenGesperrt?: boolean;
}

export interface SavedData {
  buchungen: Buchung[];
  savedMonths: SavedMonth[];
  fixKosten: FixKostenEintrag[];
  sparEintraege: SparschweinEintrag[];
}

export interface SavedMonth {
  date: Date;
  totalBudget: number;
  sparen: number;
  fixkosten?: FixKostenEintrag[];
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
  newSpareintraege?: SparschweinEintrag[];
  editedSpareintraege?: SparschweinEintrag[];
  deletedSpareintragIds?: number[];
}

export interface UpdateValuesForMonth {
  date: Date;
  newSparen?: number;
  newTotalBudget?: number;
  newMaxDayBudget?: number;
  newFixkostenEintraege?: FixKostenEintrag[];
  deletedFixkostenEintreageIds?: number[];
  editedFixKostenEintraege?: FixKostenEintrag[];
}

export interface SparschweinData {
  erspartes: number;
  eintraege: SparschweinEintrag[];
}

export interface SparschweinEintrag {
  isMonatEintrag?: boolean;
  betrag: number;
  date: Date;
  id: number;
  title?: string;
  zusatz?: string;
}

export interface MenuItem {
  label: string;
  onClick: () => void;
}