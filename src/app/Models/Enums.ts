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
