import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {BarChartViewModel, IAuswertungsLayout, IDiagrammData} from "../../Models/NewInterfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";

@Component({
  selector: 'app-auswertungen',
  templateUrl: './auswertungen.component.html',
  styleUrl: './auswertungen.component.css'
})
export class AuswertungenComponent implements OnInit {

  chart1?: BarChartViewModel;
  chart2?: BarChartViewModel;
  chart3?: BarChartViewModel;
  layoutOptions!: IAuswertungsLayout[]

  selectedLayout: string = 'Ausgaben-Verhalten für Monat';

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

  constructor(private dataChangeService: DataChangeService, private dataProvider: DataProviderService, private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('AUSWERTUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.layoutOptions = this.dataProvider.getAuswertungsLayouts();
    this.updateLayout();
  }

  update() {
    this.layoutOptions = this.dataProvider.getAuswertungsLayouts();
    this.updateLayout();
  }

  updateLayout() {
    const layout = this.layoutOptions.find(option => option.data.titel === this.selectedLayout);
    if (!layout) {
      console.log('hinzufügen wurde geclickt');
      return;
    }

    this.chart1 = this.getBarChartViewModelFromDiagrammData(layout.data.diagramme[0]);
    if (layout.data.diagramme[1]) {
      this.chart2 = this.getBarChartViewModelFromDiagrammData(layout.data.diagramme[1]);
    } else {
      this.chart2 = undefined;
    }
    if (layout.data.diagramme[2]) {
      this.chart3 = this.getBarChartViewModelFromDiagrammData(layout.data.diagramme[2]);
    } else {
      this.chart3 = undefined;
    }
  }

  onEditLayoutsButtonClicked() {
    console.log(1)
  }

  getSelectedLayoutOptionIndex() {
    return this.layoutOptions.findIndex(option => option.data.titel === this.selectedLayout);
  }

  getBarChartViewModelFromDiagrammData(diagrammData: IDiagrammData): BarChartViewModel {
    let labels;
    const data: number[] = [];
    switch (diagrammData.xAchsenSkalierung) {
      case XAchsenSkalierungsOptionen.alleMonateImJahr:
        labels = [
          'Januar', 'Februar', 'März', 'April',
          'Mai', 'Juni', 'Juli', 'August',
          'September', 'Oktober', 'November', 'Dezember'
        ];

        for (let i = 0; i < 12; i++) {
          const date = new Date(this.selectedYear() ?? new Date().getFullYear(), i, 1);
          const month = this.dataProvider.getMonthByDate(date)
          if (month) {
            switch (diagrammData.valueOption) {
              case BarChartValueOptions.Ausgaben:
                data.push(this.dataProvider.getAusgabenForMonth(month.startDate, diagrammData.filter) ?? 0);
                break;
              case BarChartValueOptions.Restgeld:
                data.push(month.istBudget ?? 0);
                break;
              case BarChartValueOptions.Sparen:
                data.push(month.sparen ?? 0);
                break;
              case BarChartValueOptions.TotalBudget:
                data.push(month.totalBudget ?? 0);
                break;
              case BarChartValueOptions.DifferenzZuDaySollBudget:
                throw new Error('alleMonateImJahr darf nicht mit differenzZuDaySollBudget verwendet werden!');
                break;
            }
          } else {
            data.push(0);
          }
        }
        break;
      case XAchsenSkalierungsOptionen.alleTageImMonat:
        const month = this.dataProvider.getMonthByDate(new Date(this.selectedYear(), this.selectedMonthIndex(), 1))
        labels = Array.from({length: month.daysInMonth!}, (_, i) => `${i + 1}.${this.selectedMonth()}`);

        if (month) {
          switch (diagrammData.valueOption) {
            case BarChartValueOptions.Ausgaben:
              const filteredBuchungenAusgaben = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filter);
              for (let i = 0; i < month.daysInMonth!; i++) {
                data.push(0);
              }

              filteredBuchungenAusgaben.forEach(buchung => {
                data[buchung.data.date.getDate() - 1] += buchung.data.betrag!;
              })
              break;
            case BarChartValueOptions.Restgeld:
              const filteredBuchungen = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filter);
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
                const today = new Date();
                if(today.getDate() - 1 < i) {
                  data[i] = 0;
                } else {
                  data[i] = month.budget! - ausgabeGesammt;
                }
              }
              break;
            case BarChartValueOptions.Sparen:
              data.push(month.sparen ?? 0);
              break;
            case BarChartValueOptions.TotalBudget:
              data.push(month.totalBudget ?? 0);
              break;
            case BarChartValueOptions.DifferenzZuDaySollBudget:
              const filteredBuchungenDif = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filter);
              let alleAusgabenDaysDif: number[] = [];

              for (let i = 0; i < month.daysInMonth!; i++) {
                alleAusgabenDaysDif.push(0);
                data.push(0);
              }

              console.log(alleAusgabenDaysDif)

              filteredBuchungenDif.forEach(buchung => {
                alleAusgabenDaysDif[buchung.data.date.getDate() - 1] += buchung.data.betrag!;
              })

              for (let i = 0; i < month.daysInMonth!; i++) {
                const today = new Date();
                if(today.getDate() - 1 < i) {
                  data[i] = 0;
                } else {
                  data[i] = month.dailyBudget! - alleAusgabenDaysDif[i];
                }
              }
              break;
          }
        } else {
          data.push(0);
        }

        break;
    }

    return {
      diagramLabel: diagrammData.title,
      labels: labels,
      datasets: [{
        label: diagrammData.title,
        data: data,
        backgroundColor: 'rgba(67,182,255,0.6)'
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
