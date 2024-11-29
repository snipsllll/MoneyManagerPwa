import {Injectable} from '@angular/core';
import {
  IBuchung,
  IGeplanteAusgabenKategorie,
  IMonthFixkostenEintrag,
  ISparschweinEintrag,
  IWunschlistenEintrag
} from "../../Models/NewInterfaces";
import {DataService} from "../DataService/data.service";
import {
  AvailableMoney,
  BudgetInfosForMonth,
  Day, IGeplanteAusgabe,
  IGeplanteAusgabenBuchung, IGeplanteAusgabeRestgeld,
  Month,
  Settings
} from "../../Models/Interfaces";
import {UT} from "../../Models/Classes/UT";
import {IAuswertungsLayout, IDiagrammData} from "../../Models/Auswertungen-Interfaces";

@Injectable({
  providedIn: 'root'
})
export class DataProviderService {

  private utils = new UT();

  constructor(private dataService: DataService) {
  }

  getAlleWunschlistenEintraege(): IWunschlistenEintrag[] {
    return this.dataService.userData.wunschlistenEintraege;
  }

  getAlleSparschweinEintraege(): ISparschweinEintrag[] {
    const sparschweinEintraege = this.utils.clone(this.dataService.userData.sparschweinEintraege) as ISparschweinEintrag[];
    const months = this.dataService.userData.months;
    months.forEach(month => {
      if (month.monatAbgeschlossen) {
        sparschweinEintraege.push(
          {
            id: -1,
            data: {
              betrag: month.istBudget!,
              date: month.endDate!,
              title: this.getMonatJahrTextForMonth(month),
              vonMonat: true
            }
          }
        )
      }
    })

    return sparschweinEintraege;
  }

  getFixkostenEintraegeForMonth(date: Date, onlyIncluded?: boolean) {
    const month = this.getMonthByDate(date);

    const a: IMonthFixkostenEintrag[] = (month && month.specialFixkostenEintraege ? month.specialFixkostenEintraege : []).map((eintrag): IMonthFixkostenEintrag => {
      return {
        id: eintrag.id,
        data: {
          isStandardFixkostenEintrag: false,
          ...eintrag.data
        }
      }
    })

    const b: IMonthFixkostenEintrag[] = (month && month.uebernommeneStandardFixkostenEintraege ? month.uebernommeneStandardFixkostenEintraege : []).map((eintrag): IMonthFixkostenEintrag => {
      return {
        id: eintrag.id,
        data: {
          isStandardFixkostenEintrag: true,
          ...eintrag.data
        }
      }
    })

    let alleEintraege = b.concat(a);

    if (onlyIncluded) {
      alleEintraege = alleEintraege.filter(eintrag => eintrag.data.isExcluded !== true);
    }

    return alleEintraege;
  }

  getGeplanteAusgabenEintraegeForMonth(date: Date) {
    const month = this.getMonthByDate(date);
    return month.geplanteAusgaben;
  }

  getAnzahlDaysLeftForMonth(date: Date) {
    const month = this.getMonthByDate(date);
    return month.daysInMonth! - date.getDate();
  }

  getErspartes() {
    let eintraege = this.getAlleSparschweinEintraege();
    let erspartes = 0;

    eintraege.forEach(eintrag => {
      erspartes += eintrag.data.betrag;
    })

    return +(erspartes);
  }

  getBuchungById(buchungsId: number) {
    const buchung = this.dataService.userData.buchungen.find(buchung => buchung.id === buchungsId);
    if (buchung && buchung.data.buchungsKategorie === undefined) {
      buchung.id = 0;
    }
    return buchung;
  }

  getGeplanteAusgabenBuchungById(id: number): IBuchung {
    const x = this.dataService.userData.geplanteAusgabenBuchungen.find(buchung => buchung.id === id);
    if(!x) {
      throw new Error(`geplanteAusgabenBuchung mit id: ${id} wurde nicht gefunden!`)
    }
    return {
      id: x.id,
      data: {
        betrag: x?.data.betrag,
        title: x?.data.title,
        time: x?.data.time,
        buchungsKategorie: x?.data.buchungsKategorie,
        date: x?.data.date,
        beschreibung: x?.data.beschreibung,
        geplanteBuchung: true
      }
    }
  }

  getDayByeDate(date: Date): Day | undefined {
    const month = this.getMonthByDate(date);
    let selectedDay: Day | undefined = undefined;

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if (day.date.toLocaleDateString() === date.toLocaleDateString()) {
          selectedDay = day;
        }
      })
    })

    return selectedDay;
  }

  getAllDays() {
    const months: Month[] = this.dataService.userData.months;
    const days: Day[] = []
    months.forEach(month => {
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          if ((day.buchungen && day.buchungen.length > 0) || (day.geplanteAusgabenBuchungen && day.geplanteAusgabenBuchungen.length > 0)) {
            days.push(day);
          }
        })
      })
    });
    return days;
  }

  getAlleBuchungenForMonth(date: Date) {
    const month = this.getMonthByDate(date);

    const alleBuchungen: IBuchung[] = [];

    month.weeks?.forEach(week => {
      week.days?.forEach(day => {
        day.buchungen?.forEach(buchung => {
          alleBuchungen.push(buchung);
        })
      })
    });

    return alleBuchungen;
  }

  getAvailableMoneyForDay(dayDate: Date): number {
    const month = this.getMonthByDate(dayDate);
    const x = this.getDictForDayBudgetsInMonth(dayDate);

    let isDayReached = false;
    let daysLeftOver = month.daysInMonth!;
    let notSpendMoney = 0;
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        if (!isDayReached) {
          if (day.date.getDate() === dayDate.getDate()) {
            isDayReached = true;
          }

          let moneySpendOnDay = 0;
          day.buchungen?.forEach(buchung => {
            moneySpendOnDay += buchung.data.betrag!;
          })

          notSpendMoney += x[day.date.toLocaleDateString()] - moneySpendOnDay;
          daysLeftOver--;
        }
      })
    })
    return notSpendMoney;
  }

  getAvailableMoneyForDayFromSoll(date: Date) {
    const month = this.getMonthByDate(date);

    return (month.dailyBudget ?? 0) - this.getAusgabenForDay(date);
  }

  getAusgabenForDay(date: Date) {
    const day = this.getDayByeDate(date);
    let ausgaben = 0;

    day?.buchungen?.forEach(buchung => {
      ausgaben += buchung.data.betrag ?? 0;
    });

    return ausgaben;
  }

  getAvailableMoney(dayDate: Date): AvailableMoney {
    if (this.getMonthByDate(dayDate).totalBudget === undefined || this.getMonthByDate(dayDate).totalBudget === 0) {
      return {
        availableForMonth: -0,
        availableForWeek: -0,
        availableForDay: -0,
        noData: true
      };
    }
    const availableForDay = this.getAvailableMoneyForDay(dayDate);
    const daySollBudgets = this.getDictForDayBudgetsInMonth(dayDate);

    let availableForWeek = availableForDay;
    let isDayReached = false;
    this.getMonthByDate(dayDate).weeks![this.getIndexOfWeekInMonth(dayDate)].days.forEach(day => {
      if (isDayReached) {
        availableForWeek += daySollBudgets[day.date.toLocaleDateString()];
      }
      if (day.date.getDate() === dayDate.getDate()) {
        isDayReached = true;
      }
    })

    const availableForMonth = this.getMonthByDate(dayDate).istBudget!;

    return {
      availableForDay: availableForDay,
      availableForWeek: availableForWeek,
      availableForMonth: availableForMonth,
      noData: false
    }
  }

  getAuswertungsLayouts(): IAuswertungsLayout[] {
    const auswertungsLayouts: IAuswertungsLayout[] = [];

    auswertungsLayouts.push({
      id: -1,
      data: {
          layoutTitle: 'Ausgaben-Verhalten für Monat',
          diagramme: [
            {
              id: -1,
              data: {
                selectedDiagramType: 'Ausgaben pro Tag',
                diagramTitle: 'Ausgaben pro Tag',
                balkenBeschriftung: 'Ausgaben (in Euro)',
                xAchse: 'Alle tage im Monat',
                yAchse: 'Ausgaben',
                lineOption: {
                  lineType: 'daily Budget'
                }
              }
            },{
            id: -2,
            data: {
              selectedDiagramType: 'Restgeld für Monat',
              diagramTitle: 'Restgeld für Monat',
              balkenBeschriftung: 'Restgeld für Monat (in Euro)',
              xAchse: 'Alle tage im Monat',
              yAchse: 'Restgeld für Monat',
            }
          },
          {
            id: -3,
            data: {
              selectedDiagramType: 'Restgeld für Tag',
              diagramTitle: 'Restgeld für Tag',
              balkenBeschriftung: 'Restgeld für Tag (in Euro)',
              xAchse: 'Alle tage im Monat',
              yAchse: 'Restgeld pro Tag'
            }
          }
        ]
      }
    })

    auswertungsLayouts.push({
      id: -2,
      data: {
        layoutTitle: 'Sparenübersicht für Jahr',
        diagramme: [
          {
            id: -4,
            data: {
              selectedDiagramType: 'Geplante Sparbeträge pro Monat',
              diagramTitle: 'Geplante Sparbeträge pro Monat',
              balkenBeschriftung: 'Sparen-Betrag (in Euro)',
              xAchse: 'alle Monate im Jahr',
              yAchse: 'geplanter Sparbetrag'
            }
          },
          {
            id: -5,
            data: {
              selectedDiagramType: 'Tatsächlich gespart pro Monat',
              diagramTitle: 'Tatsächlich gespart pro Monat',
              balkenBeschriftung: 'Betrag (in Euro)',
              xAchse: 'alle Monate im Jahr',
              yAchse: 'ins Sparschwein eingezahlt'
            }
          }
        ]
      }
    })

    const manuelleLayouts = this.dataService.userData.auswertungsLayouts;

    manuelleLayouts.forEach(layout => {
      auswertungsLayouts.push(layout);
    })

    return auswertungsLayouts;
  }

  getPresetDiagramme(): IDiagrammData[] {
    let diagramme: IDiagrammData[] = [];

    diagramme.push({
      selectedDiagramType: 'Restgeld für Monat',
      diagramTitle: 'Restgeld für Monat',
      balkenBeschriftung: 'Restgeld für Monat (in Euro)',
      xAchse: 'Alle tage im Monat',
      yAchse: 'Restgeld für Monat',
    });

    diagramme.push({
      selectedDiagramType: 'Ausgaben pro Tag',
      diagramTitle: 'Ausgaben pro Tag',
      balkenBeschriftung: 'Ausgaben (in Euro)',
      xAchse: 'Alle tage im Monat',
      yAchse: 'Ausgaben',
      lineOption: {
        lineType: 'daily Budget'
      }
    });

    diagramme.push({
      selectedDiagramType: 'Restgeld für Tag',
      diagramTitle: 'Restgeld für Tag',
      balkenBeschriftung: 'Restgeld für Tag (in Euro)',
      xAchse: 'Alle tage im Monat',
      yAchse: 'Restgeld pro Tag'
    });

    diagramme.push({
      selectedDiagramType: 'Geplante Sparbeträge pro Monat',
      diagramTitle: 'Geplante Sparbeträge pro Monat',
      balkenBeschriftung: 'Sparen-Betrag (in Euro)',
      xAchse: 'alle Monate im Jahr',
      yAchse: 'geplanter Sparbetrag'
    });

    diagramme.push({
      selectedDiagramType: 'Tatsächlich gespart pro Monat',
      diagramTitle: 'Tatsächlich gespart pro Monat',
      balkenBeschriftung: 'Betrag (in Euro)',
      xAchse: 'alle Monate im Jahr',
      yAchse: 'ins Sparschwein eingezahlt'
    });

    diagramme.push({
      selectedDiagramType: 'Kategorien Ausgaben für Monat',
      diagramTitle: 'Kategorien Ausgaben für Monat',
      balkenBeschriftung: 'Betrag (in Euro)',
      xAchse: 'Kategorien',
      yAchse: 'Monat'
    });

    diagramme.push({
      selectedDiagramType: 'Kategorien Ausgaben für Jahr',
      diagramTitle: 'Kategorien Ausgaben für Jahr',
      balkenBeschriftung: 'Betrag (in Euro)',
      xAchse: 'Kategorien',
      yAchse: 'Jahr'
    });

    return diagramme;
  }

  getAusgabenForMonth(date: Date, filter?: { filter: string, value: any }) {
    const filteredBuchungen = this.getAlleBuchungenForMonthFiltered(date, filter);
    let summe = 0;

    filteredBuchungen.forEach(buchung => {
      summe += buchung.data.betrag ?? 0;
    })

    return summe;
  }

  getAlleBuchungenForMonthFiltered(date: Date, filter?: { filter: string, value: any }) {
    const month = this.getMonthByDate(date);
    let filteredBuchungen: IBuchung[] = [];

    if (filter) {
      month.weeks?.forEach(week => {
        week.days.forEach(day => {
          day.buchungen?.forEach(buchung => {
            if (this.passtBuchungZuFilter(buchung, filter)) {
              filteredBuchungen.push(buchung)
            }
          })
        })
      })
      return filteredBuchungen;
    }

    const buchungen: IBuchung[] = [];
    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        day.buchungen?.forEach(buchung => {
          buchungen.push(buchung);
        })
      })
    })

    return buchungen;
  }

  passtBuchungZuFilter(buchung: IBuchung, filter: { filter: string, value: any }) {
    switch (filter.filter) {
      case 'nach Kategorie':
        return this.getBuchungsKategorieNameById(+(buchung.data.buchungsKategorie)!) === filter.value;
      case 'nach Wochentag':
        return buchung.data.date.getDay() === this.getNumberFromWochentagString(filter.value);
    }
    return true;
  }

  getAvailableMoneyCapped(dayDate: Date): AvailableMoney {
    const availableMoney = this.getAvailableMoney(dayDate);

    availableMoney.availableForDay = availableMoney.availableForDay > 0 ? availableMoney.availableForDay : 0;
    availableMoney.availableForWeek = availableMoney.availableForWeek > 0 ? availableMoney.availableForWeek : 0;
    availableMoney.availableForMonth = availableMoney.availableForMonth > 0 ? availableMoney.availableForMonth : 0;

    return availableMoney;
  }

  getAvailableMoneyForGeplanteAusgabenKategorienForDay(date: Date): IGeplanteAusgabeRestgeld[] {
    const geplanteAusgaben: IGeplanteAusgabeRestgeld[] = [];

    const month = this.getMonthByDate(date);
    const geplanteAusgabenKategorien = this.getGeplanteAusgabenKategorienForMonth(date);

    console.log(geplanteAusgabenKategorien)

    geplanteAusgabenKategorien.forEach(geplanteAusgabenKategorie => {
      geplanteAusgaben.push({
        id: geplanteAusgabenKategorie.id,
        restgeldBetrag: geplanteAusgabenKategorie.betrag,
        title: geplanteAusgabenKategorie.title
      })
    })


    month.weeks!.forEach(week => {
      week.days.forEach(day => {
        day.geplanteAusgabenBuchungen?.forEach(geplanteBuchung => {
          let index = geplanteAusgaben.findIndex(eintrag => eintrag.id! ==  +(geplanteBuchung.data.buchungsKategorie!));
          console.log(geplanteAusgaben[index])
          console.log(geplanteBuchung)
          geplanteAusgaben[index].restgeldBetrag -= geplanteBuchung.data.betrag ?? 0;
        })
      })
    })


    return geplanteAusgaben;
  }

  getFixkostenSummeForMonth(month: Month) {
    let summe = 0;
    const eintraege = this.getFixkostenEintraegeForMonth(month.startDate, true);
    if (!eintraege)
      return 0;

    eintraege.forEach(eintrag => {
      summe += eintrag.data.betrag;
    })
    return summe;
  }

  getGeplanteAusgabenSummeForMonth(month: Month) {
    let summe = 0;
    const eintraege = this.getGeplanteAusgabenEintraegeForMonth(month.startDate);
    if (!eintraege)
      return 0;

    eintraege.forEach(eintrag => {
      summe += eintrag.data.betrag;
    })
    return summe;
  }

  getGeplanteAusgabenBuchungForMonth(month: Month) {
    return this.dataService.userData.geplanteAusgabenBuchungen.filter(eintrag => eintrag.data.date.getMonth() === month.startDate.getMonth() && eintrag.data.date.getFullYear() === month.startDate.getFullYear())
  }

  checkIfMonthExistsForDay(date: Date) {
    return this.dataService.userData.months.findIndex(month => month.startDate.getMonth() === date.getMonth() && month.startDate.getFullYear() === date.getFullYear()) !== -1;
  }

  isDayBeforeMonth(dayDate: Date, month: Month) {
    if (dayDate.getFullYear() > month.startDate.getFullYear()) {
      return false;
    }
    if (dayDate.getFullYear() < month.startDate.getFullYear()) {
      return true
    }
    return dayDate.getMonth() < month.startDate.getMonth();
  }

  getMonthByDate(date: Date) {
    return this.dataService.userData.months[this.getIndexOfMonth(date)];
  }

  getSettings(): Settings {
    return this.dataService.userData.settings;
  }

  getBudgetInfosForMonth(date: Date): BudgetInfosForMonth | null {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return null;
    }
    const month = this.dataService.userData.months[monthIndex];

    return {
      budget: month.budget ?? 0,
      sparen: month.sparen ?? 0,
      totalBudget: month.totalBudget ?? 0,
      istBudget: month.istBudget,
      dayBudget: month.dailyBudget ?? 0,
      fixKostenSumme: this.getFixkostenSummeForMonth(month),
      fixKostenGesperrt: month.monatAbgeschlossen ?? false,
      fixKostenEintraege: this.getFixkostenEintraegeForMonth(month.startDate, true),
      geplanteAusgabenSumme: this.getGeplanteAusgabenSummeForMonth(month),
      geplanteAusgaben: this.getGeplanteAusgabenEintraegeForMonth(month.startDate),
      geplanteAusgabenRestgeld: this.getGeplanteAusgabenRestgeldForMonth(month)
    }
  }

  getGeplanteAusgabenRestgeldForMonth(month: Month): number {
    const geplantBetrag = this.getGeplanteAusgabenSummeForMonth(month);
    const ausgabenSumme = this.getAusgegebenesGeldVonGeplantenAusgabenForMonth(month);

    return geplantBetrag - ausgabenSumme;
  }

  getAusgegebenesGeldVonGeplantenAusgabenForMonth(month: Month): number {
    let ausgabenSumme = 0;
    this.getGeplanteAusgabenBuchungForMonth(month)?.forEach(eintrag => {
      ausgabenSumme += eintrag.data.betrag ?? 0;
    })
    return ausgabenSumme;
  }

  getBuchungsKategorienNamen() {
    return this.dataService.userData.getKategorienNamen();
  }

  getBuchungsKategorienMitEmpty() {
    const x = this.utils.clone(this.dataService.userData.buchungsKategorien) as { id: number, name: string }[];
    x.push({id: 0, name: ''})
    return x;
  }

  getGeplanteAusgabenKategorienForMonth(date: Date): IGeplanteAusgabenKategorie[] {
    const month = this.getMonthByDate(date);

    let geplanteAusgabenKategorien: IGeplanteAusgabenKategorie[] = [];

    month.geplanteAusgaben?.forEach(geplanteAusgabe => {
      geplanteAusgabenKategorien.push({
        id: geplanteAusgabe.id,
        title: geplanteAusgabe.data.title,
        betrag: geplanteAusgabe.data.betrag
      })
    })

    return geplanteAusgabenKategorien;
  }

  getBuchungsKategorien() {
    return this.utils.clone(this.dataService.userData.buchungsKategorien) as { id: number, name: string }[];
  }

  getBuchungsKategorieNameById(id: number) {
    const kategorie = this.dataService.userData.buchungsKategorien.find(k => k.id === id);
    return kategorie ? kategorie.name : '---';
  }

  getplannedBuchungsKategorieNameById(id: number) {
    const allePlannedAusgabenKategorien: IGeplanteAusgabenKategorie[] = [];
    this.dataService.userData.months.forEach(month => {
      allePlannedAusgabenKategorien.concat(this.getGeplanteAusgabenKategorienForMonth(month.startDate));
    })

    const kategorie = allePlannedAusgabenKategorien.find(k => k.id === id);
    return kategorie ? kategorie.title : '---';
  }

  getAllMonthsForYear(year: number) {
    const months = this.dataService.userData.months;
    return months.filter(month => month.startDate.getFullYear() === year);
  }

  private getDictForDayBudgetsInMonth(monthDate: Date) {
    const month = this.getMonthByDate(monthDate);

    let dict: { [date: string]: number } = {};
    let budget = month.budget!;
    let daysLeft = month.daysInMonth!;

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        dict[day.date.toLocaleDateString()] = budget / daysLeft;
        budget -= dict[day.date.toLocaleDateString()];
        daysLeft--;
      })
    })

    return dict;
  }

  private getIndexOfWeekInMonth(date: Date): number {
    const monthIndex = this.getIndexOfMonth(date);
    if (monthIndex === -1) {
      return -1;
    }
    const x = this.dataService.userData.months[monthIndex].weeks?.findIndex(week => {
      return week.days.find(day => day.date.toLocaleDateString() === date.toLocaleDateString());
    });

    if (x === undefined) {
      console.log('week not found')
      return -1;
    }
    return x;
  }

  private getIndexOfMonth(date: Date) {
    const year = new Date(date).getFullYear();
    const month = new Date(date).getMonth();
    const monthStartDate = new Date(year, month);
    return this.dataService.userData.months.findIndex(monat => monat.startDate.toLocaleDateString() === monthStartDate.toLocaleDateString())
  }

  private getMonatJahrTextForMonth(month: Month) {
    let monthText: string = '';

    switch (month.startDate.getMonth()) {
      case 0:
        monthText = 'Januar';
        break;
      case 1:
        monthText = 'Februar';
        break;
      case 2:
        monthText = 'März';
        break;
      case 3:
        monthText = 'April';
        break;
      case 4:
        monthText = 'Mai';
        break;
      case 5:
        monthText = 'Juni';
        break;
      case 6:
        monthText = 'Juli';
        break;
      case 7:
        monthText = 'August';
        break;
      case 8:
        monthText = 'September';
        break;
      case 9:
        monthText = 'Oktober';
        break;
      case 10:
        monthText = 'November';
        break;
      case 11:
        monthText = 'Dezember';
        break;
    }

    const yearText = month.startDate.getFullYear().toString();

    return `Restgeld von ${monthText} ${yearText}`;
  }

  getNumberFromWochentagString(value: string): number {
    switch (value) {
      case 'Sonntag':
        return 1;
      case 'Montag':
        return 2;
      case 'Dienstag':
        return 3;
      case 'Mitwoch':
        return 4;
      case 'Donnerstag':
        return 5;
      case 'Freitag':
        return 6;
      case 'Samstag':
        return 7;
    }
    return -1;
  }
}
