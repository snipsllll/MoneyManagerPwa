import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {BarChartViewModel, IAuswertungsLayout, IBuchung, IDiagrammData} from "../../Models/NewInterfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {DataChangeService} from "../../Services/DataChangeService/data-change.service";
import {BarChartFilterOptions, BarChartValueOptions, XAchsenSkalierungsOptionen} from "../../Models/Enums";
import {switchAll} from "rxjs";

@Component({
  selector: 'app-auswertungen',
  templateUrl: './auswertungen.component.html',
  styleUrl: './auswertungen.component.css'
})
export class AuswertungenComponent implements OnInit {

  chart1?: BarChartViewModel;
  chart2?: BarChartViewModel;
  chart3?: BarChartViewModel;

  ausgabenProTagCVM!: BarChartViewModel;
  totalBudgetCVMForMonthsInYear!: BarChartViewModel;
  nichtAusgegebenesGeldCVMForMonthsInYear!: BarChartViewModel;
  ausgabenForMonatProTagKategorisiertCVM!: BarChartViewModel[];
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
    this.ausgabenProTagCVM = this.getDailyAusgabenCVMForMonth();
    this.totalBudgetCVMForMonthsInYear = this.getTotalBudgetCVMForMonthsInYear();
    this.nichtAusgegebenesGeldCVMForMonthsInYear = this.getNichtAusgegebenesGeldCVMForMonthsInYear();
    this.ausgabenForMonatProTagKategorisiertCVM = this.getAusgabenForMonatProtagKategorisiertCVM();
    this.layoutOptions = this.dataProvider.getAuswertungsLayouts();
    this.updateLayout();
  }

  update() {
    this.ausgabenProTagCVM = this.getDailyAusgabenCVMForMonth(new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    this.totalBudgetCVMForMonthsInYear = this.getTotalBudgetCVMForMonthsInYear(this.selectedYear());
    this.nichtAusgegebenesGeldCVMForMonthsInYear = this.getNichtAusgegebenesGeldCVMForMonthsInYear(this.selectedYear());
    this.ausgabenForMonatProTagKategorisiertCVM = this.getAusgabenForMonatProtagKategorisiertCVM(new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    this.layoutOptions = this.dataProvider.getAuswertungsLayouts();
  }

  updateLayout() {
    const layout = this.layoutOptions.find(option => option.data.titel === this.selectedLayout);
    if (!layout) {
      console.log('hinzufügen wurde geclickt');
      return;
    }

    this.chart1 = this.getBarChartViewModelFromDiagrammData(layout.data.diagramme[0]);
    if(layout.data.diagramme[1]){
      this.chart2 = this.getBarChartViewModelFromDiagrammData(layout.data.diagramme[1]);
    } else {
      this.chart2 = undefined;
    }
    if(layout.data.diagramme[2]){
      this.chart3 = this.getBarChartViewModelFromDiagrammData(layout.data.diagramme[2]);
    } else {
      this.chart3 = undefined;
    }
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
            }
          } else {
            data.push(0);
          }
        }
        break;
      case XAchsenSkalierungsOptionen.alleTageImMonat:
        const month = this.dataProvider.getMonthByDate(new Date(this.selectedYear(), this.selectedMonthIndex(), 1))
        const filteredBuchungen = this.dataProvider.getAlleBuchungenForMonthFiltered(new Date(this.selectedYear(), this.selectedMonthIndex(), 1), diagrammData.filter);
        labels = Array.from({length: month.daysInMonth!}, (_, i) => `${i + 1}.${this.selectedMonthIndex() + 1}`);

        for (let i = 0; i < month.daysInMonth!; i++) {
          data.push(0);
        }

        filteredBuchungen.forEach(buchung => {
          data[buchung.data.date.getDate() - 1] += buchung.data.betrag!;
        })
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

  getDailyAusgabenCVMForMonth(date ?: Date): BarChartViewModel {
    date = date ?? new Date();
    const month = this.dataProvider.getMonthByDate(date);

    let data: number[] = [];
    if (!month) {
      return {
        diagramLabel: '',
        datasets: [],
        labels: []
      }
    }

    month.weeks?.forEach(week => {
      week.days.forEach(day => {
        let ausgaben = 0;
        day.buchungen?.forEach(buchung => {
          ausgaben += buchung.data.betrag ?? 0;
        })
        data.push(ausgaben);
      })
    })

    let chartViewModel: BarChartViewModel = {
      diagramLabel: `Ausgaben für ${this.selectedMonth()}, ${this.selectedYear}`,
      labels: Array.from({length: month.daysInMonth!}, (_, i) => `Tag ${i + 1}`), // Labels von "Tag 1" bis "Tag 30"
      datasets: [
        {
          label: 'Ausgaben pro Tag',
          data: data,
          backgroundColor: 'rgba(67,182,255,0.6)'
        }
      ],
    };

    return chartViewModel;
  }

  getTotalBudgetCVMForMonthsInYear(year ?: number) {
    const data: number[] = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(year ?? new Date().getFullYear(), i, 1);
      const month = this.dataProvider.getMonthByDate(date)
      if (month) {
        data.push(month!.totalBudget ?? 0)
      } else {
        data.push(0);
      }
    }

    let chartViewModel: BarChartViewModel = {
      diagramLabel: `TotalBudgets für ${this.selectedYear}`,
      labels: [
        'Januar', 'Februar', 'März', 'April',
        'Mai', 'Juni', 'Juli', 'August',
        'September', 'Oktober', 'November', 'Dezember'
      ], // Labels von "Tag 1" bis "Tag 30"
      datasets: [
        {
          label: 'Total Budget pro Monat',
          data: data,
          backgroundColor: 'rgba(67,182,255,0.6)'
        }
      ],
    };

    return chartViewModel;
  }

  getNichtAusgegebenesGeldCVMForMonthsInYear(year ?: number) {
    const data: number[] = [];

    for (let i = 0; i < 12; i++) {
      const date = new Date(year ?? new Date().getFullYear(), i, 1);
      const month = this.dataProvider.getMonthByDate(date)
      if (month) {
        data.push(month!.istBudget ?? 0)
      } else {
        data.push(0);
      }
    }

    let chartViewModel: BarChartViewModel = {
      diagramLabel: `Gespartes Geld für ${this.selectedYear}`,
      labels: [
        'Januar', 'Februar', 'März', 'April',
        'Mai', 'Juni', 'Juli', 'August',
        'September', 'Oktober', 'November', 'Dezember'
      ], // Labels von "Tag 1" bis "Tag 30"
      datasets: [
        {
          label: 'Übriges Geld pro Monat',
          data: data,
          backgroundColor: 'rgba(67,182,255,0.6)'
        }
      ],
    };

    return chartViewModel;
  }

  getAusgabenForMonatProtagKategorisiertCVM(date ?: Date): BarChartViewModel[] {
    const kategorien = this.dataProvider.getBuchungsKategorien();
    const month = this.dataProvider.getMonthByDate(date ?? new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    if (!month) {
      return [{
        diagramLabel: '',
        datasets: [],
        labels: []
      }]
    }
    const alleBuchungenInMonth = this.dataProvider.getAlleBuchungenForMonth(new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    const viewModelList: BarChartViewModel[] = [];

    kategorien.forEach(kategorie => {
      const filteredBuchungen = alleBuchungenInMonth.filter(buchung => buchung.data.buchungsKategorie === kategorie.id);
      const data: number[] = []
      const labels = Array.from({length: month.daysInMonth!}, (_, i) => `Tag ${i + 1}`);


      for (let i = 0; i < month.daysInMonth!; i++) {
        data.push(0);
      }

      filteredBuchungen.forEach(buchung => {
        data[buchung.data.date.getDate()] += buchung.data.betrag!;
      })

      const barChartViewModel: BarChartViewModel = {
        diagramLabel: `Ausgaben für ${this.selectedMonth()}, ${this.selectedYear} (${kategorie.name}`,
        labels: labels,
        datasets: [
          {
            label: `Ausgaben für ${kategorie.name}:`,
            data: data,
            backgroundColor: 'rgba(67,182,255,0.6)'
          }
        ]
      }

      viewModelList.push(barChartViewModel);
    })

    return viewModelList
  }
}
