import {Months} from "./Enums";

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
