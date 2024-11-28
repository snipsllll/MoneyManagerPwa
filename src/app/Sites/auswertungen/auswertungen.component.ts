import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {BarChartViewModel} from "../../Models/NewInterfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {DialogService} from "../../Services/DialogService/dialog.service";
import {DataService} from "../../Services/DataService/data.service";
import {IAuswertungsLayout, IDiagrammData} from "../../Models/Auswertungen-Interfaces";
import {Day} from "../../Models/Interfaces";

@Component({
  selector: 'app-auswertungen',
  templateUrl: './auswertungen.component.html',
  styleUrl: './auswertungen.component.css'
})
export class AuswertungenComponent implements OnInit {
  layoutOptions = computed<IAuswertungsLayout[]>(() => {
    this.dataService.updated();
    return this.dataProvider.getAuswertungsLayouts();
  })

  selectedLayoutString: string = 'Ausgaben-Verhalten für Monat';
  selectedLayoutCharts: BarChartViewModel[] = [];

  selectedMonth = computed(() => {
    switch (this.selectedMonthIndex()) {
      case 0:
        return 'Januar';
      case 1:
        return 'Februar';
      case 2:
        return 'März';
      case 3:
        return 'April';
      case 4:
        return 'Mai';
      case 5:
        return 'Juni';
      case 6:
        return 'Juli';
      case 7:
        return 'August';
      case 8:
        return 'September';
      case 9:
        return 'Oktober';
      case 10:
        return 'November';
      case 11:
        return 'Dezember';
    }
    return '';
  });

  selectedMonthIndex = signal<number>(new Date().getMonth());

  selectedYear = signal<number>(new Date().getFullYear());

  constructor(private dataService: DataService, private dataChangeService: DataChangeService, private dataProvider: DataProviderService, private topbarService: TopbarService, private dialogService: DialogService) {
  }

  ngOnInit() {
    this.topbarService.title.set('AUSWERTUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.updateLayout();
  }

  update() {
    this.updateLayout();
  }

  updateLayout() {
    const layout = this.layoutOptions().find(option => option.data.layoutTitle === this.selectedLayoutString);
    if (!layout) {
      return;
    }

    this.selectedLayoutCharts = [];
    layout.data.diagramme.forEach(diagram => {
      this.selectedLayoutCharts.push(this.getBarChartViewModelFromDiagrammData(diagram.data));
    })
  }

  onEditLayoutsButtonClicked() {
    this.dialogService.showAuswertungenDialog()
  }

  getBarChartViewModelFromDiagrammData(diagrammData: IDiagrammData): BarChartViewModel {
    let labels: string[] = [];
    const data: number[] = [];
    switch (diagrammData.xAchse) {
      case 'alle Monate im Jahr':
        labels = [
          'Januar', 'Februar', 'März', 'April',
          'Mai', 'Juni', 'Juli', 'August',
          'September', 'Oktober', 'November', 'Dezember'
        ];

        for (let i = 0; i < 12; i++) {
          const date = new Date(this.selectedYear() ?? new Date().getFullYear(), i, 1);
          const month = this.dataProvider.getMonthByDate(date)
          if (month) {
            switch (diagrammData.yAchse) {
              case 'Ausgaben':
                data.push(this.dataProvider.getAusgabenForMonth(month.startDate, diagrammData.filterOption) ?? 0);
                break;
              case 'ins Sparschwein eingezahlt':
                const x = this.dataProvider.getAlleSparschweinEintraege();
                let summeSparschweinEinAuszahlungen = 0;
                x.forEach(eintrag => {
                  if(eintrag.data.date.getMonth() === month.startDate.getMonth() && eintrag.data.date.getFullYear() === month.startDate.getFullYear()) {
                    summeSparschweinEinAuszahlungen += eintrag.data.betrag;
                  }
                })

                data.push(summeSparschweinEinAuszahlungen);
                break;
              case 'gespart':
                const x1 = this.dataProvider.getAlleSparschweinEintraege();
                let summeSparschweinEinAuszahlungen1 = 0;
                x1.forEach(eintrag => {
                  if(eintrag.data.date.getMonth() === month.startDate.getMonth() && eintrag.data.date.getFullYear() === month.startDate.getFullYear()) {
                    summeSparschweinEinAuszahlungen1 += eintrag.data.betrag;
                  }
                })

                data.push((month.istBudget ?? 0) + summeSparschweinEinAuszahlungen1);
                break;
              case 'Restgeld':
                data.push(month.istBudget ?? 0);
                break;
              case 'geplanter Sparbetrag':
                data.push(month.sparen ?? 0);
                break;
              case 'totalBudget':
                data.push(month.totalBudget ?? 0);
                break;
              case 'monatliches Budget':
                data.push(month.budget ?? 0);
                break;
              case 'daily Budget':
                data.push(month.dailyBudget ?? 0);
                break;
              case 'summe der Fixkosten':
                throw new Error('summe der Fixkosten ist noch nicht implementiert für alleMonateFürJahr');
                break;
              case 'von Wunschliste gekauft':
                throw new Error('von Wunschliste gekauft ist noch nicht implementiert für alleMonateFürJahr');
                break;
            }
          } else {
            data.push(0);
          }
        }
        break;
      case 'Alle tage im Monat':
        const month = this.dataProvider.getMonthByDate(new Date(this.selectedYear(), this.selectedMonthIndex(), 1))
        labels = Array.from({length: month.daysInMonth!}, (_, i) => `${i + 1}`);

        if (month) {
          const allDaysInMonthx: Day[] = [];

          month.weeks?.forEach((week) => {
            week.days.forEach(day => {
              allDaysInMonthx.push(day);
            })
          })

          switch (diagrammData.yAchse) {
            case 'Ausgaben':
              const filteredBuchungenAusgaben = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filterOption);
              for (let i = 0; i < month.daysInMonth!; i++) {
                data.push(0);
              }

              filteredBuchungenAusgaben.forEach(buchung => {
                data[buchung.data.date.getDate() - 1] += buchung.data.betrag!;
              })
              break;
            case 'Restgeld':
              const filteredBuchungen = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filterOption);
              let alleAusgabenDays: number[] = [];

              for (let i = 0; i < month.daysInMonth!; i++) {
                data.push(0);
                alleAusgabenDays[i] = 0;
              }

              filteredBuchungen.forEach(buchung => {
                alleAusgabenDays[buchung.data.date.getDate() - 1] += buchung.data.betrag!;
              })

              let ausgabeGesammt = 0;
              for (let i = 0; i < month.daysInMonth!; i++) {
                ausgabeGesammt += alleAusgabenDays[i];
                data[i] = month.budget! - ausgabeGesammt;
              }
              break;
            case 'Sparen':
              const x = this.dataProvider.getAlleSparschweinEintraege();
              for( let day=0; day<month.daysInMonth!; day++) {
                let summeAusEinzahlung = 0;
                x.forEach(eintrag => {
                  if(eintrag.data.date.getMonth() === month.startDate.getMonth() && eintrag.data.date.getFullYear() === month.startDate.getFullYear() && eintrag.data.date.getDate() - 1 === day) {
                    summeAusEinzahlung += eintrag.data.betrag;
                  }
                })
                data.push(summeAusEinzahlung);
              }
              break;
            case 'TotalBudget':
              data.push(month.totalBudget ?? 0);
              break;
            case 'Differenz zum daily Budget':
              const filteredBuchungenDif = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filterOption);
              let alleAusgabenDaysDif: number[] = [];

              for (let i = 0; i < month.daysInMonth!; i++) {
                alleAusgabenDaysDif.push(0);
                data.push(0);
              }

              filteredBuchungenDif.forEach(buchung => {
                alleAusgabenDaysDif[buchung.data.date.getDate() - 1] += buchung.data.betrag!;
              })

              for (let i = 0; i < month.daysInMonth!; i++) {
                const today = new Date();
                data[i] = month.dailyBudget! - alleAusgabenDaysDif[i];
              }
              break;
            case 'ist Budget':
              const allDaysInMonth: Day[] = [];

              month.weeks?.forEach((week) => {
                week.days.forEach(day => {
                  allDaysInMonth.push(day);
                })
              })

              console.log(allDaysInMonth)

              allDaysInMonth.forEach(day => {
                data.push(day.istBudget ?? 0);
              })
              break;
          }
        } else {
          data.push(0);
        }

        break;
    }

    let horizontaleLinieWert: number | undefined;
    let showHorizontaleLinie = diagrammData.lineOption !== undefined;
    if(showHorizontaleLinie) {
      switch(diagrammData.lineOption?.lineType) {
        case 'daily Budget':
          horizontaleLinieWert = this.dataProvider.getMonthByDate(new Date(this.selectedYear(), this.selectedMonthIndex(), 1)).dailyBudget ?? 0;
          break;
        case 'benutzerdefiniert' :
          horizontaleLinieWert = diagrammData.lineOption?.lineValue ?? 0;
      }
    }

    if(horizontaleLinieWert === 0) {
      showHorizontaleLinie = false;
    }

    return {
      diagramLabel: diagrammData.diagramTitle,
      labels: labels,
      datasets: [{
        label: diagrammData.balkenBeschriftung,
        data: data,
        backgroundColor: diagrammData.balkenColor ?? 'rgba(67,182,255,0.6)',
        horizontaleLinie: horizontaleLinieWert,
        showHorizontaleLinie: showHorizontaleLinie
      }]
    }
  }

  doesMonthExist() {
    return this.dataProvider.checkIfMonthExistsForDay(new Date(this.selectedYear(), this.selectedMonthIndex(), 1))
  }

  onMonthPrevClicked() {
    if (this.selectedMonthIndex() > 0
    ) {
      this.selectedMonthIndex.set(this.selectedMonthIndex() - 1)
    } else {
      this.selectedMonthIndex.set(11);
      this.selectedYear.set(this.selectedYear() - 1);
    }
    this.update();
  }

  onMonthNextClicked() {
    if (this.selectedMonthIndex() < 11
    ) {
      this.selectedMonthIndex.set(this.selectedMonthIndex() + 1)
    } else {
      this.selectedMonthIndex.set(0);
      this.selectedYear.set(this.selectedYear() + 1);
    }
    this.update();
  }
}
