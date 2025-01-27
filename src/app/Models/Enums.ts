export enum Months {
  Januar,
  Februar,
  März,
  April,
  Mai,
  Juni,
  Juli,
  August,
  September,
  Oktober,
  November,
  Dezember
}

export enum AbrechnungsMonate {
  Januar = "Januar",
  Februar = "Februar",
  März = "März",
  April = "April",
  Mai = "Mai",
  Juni = "Juni",
  Juli = "Juli",
  August = "August",
  September = "September",
  Oktober = "Oktober",
  November = "November",
  Dezember = "Dezember",
  Leer = ""
}

export enum SideNavElements {
  home,
  budget,
  fixkosten,
  sparschwein,
  wunschliste,
  einstellungen,
  auswertungen
}

export enum Sites {
  home,
  budget,
  createBuchung,
  editBuchung,
  buchungDetails,
  fixKosten
}

export enum DB {
  short,
  mid,
  long,
  none,
  noTD
}

export enum Color {
  red,
  green,
  black
}

export enum TopBarBudgetOptions {
  monat,
  woche,
  tagIst,
  tagSoll,
  leer
}

export enum TagesAnzeigeOptions {
  Tagesausgaben,
  RestbetragVonSollBudget,
  RestbetragVonIstBetrag,
  RestMonat,
  leer
}

export enum XAchsenSkalierungsOptionen {
  'alleMonateImJahr',
  'alleTageImMonat'
}

export enum BarChartValueOptions {
  'Restgeld',
  'Ausgaben',
  'Sparen',
  'TotalBudget',
  'DifferenzZuDaySollBudget'
}

export enum BarChartFilterOptions {
  'Kategorien',
  'Wochentag'
}

export enum HorizontalelinieOptions {
  'daySollBudget',
  'zahl'
}

export enum FixkostenPeriods {
  Month,
  Year
}
