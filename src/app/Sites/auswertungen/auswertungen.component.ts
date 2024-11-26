import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {BarChartViewModel} from "../../Models/NewInterfaces";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {Budget} from "@angular-devkit/build-angular";

@Component({
  selector: 'app-auswertungen',
  templateUrl: './auswertungen.component.html',
  styleUrl: './auswertungen.component.css'
})
export class AuswertungenComponent implements OnInit{

  chart1?: BarChartViewModel;
  chart2?: BarChartViewModel;
  chart3?: BarChartViewModel;

  ausgabenProTagCVM!: BarChartViewModel;
  totalBudgetCVMForMonthsInYear!: BarChartViewModel;
  nichtAusgegebenesGeldCVMForMonthsInYear!: BarChartViewModel;
  ausgabenForMonatProTagKategorisiertCVM!: BarChartViewModel[];

  selectedLayout: string = '';

  selectedMonth = computed(() =>{
    switch(this.selectedMonthIndex()){
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

  constructor(private dataProvider: DataProviderService, private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('AUSWERTUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.ausgabenProTagCVM = this.getDailyAusgabenCVMForMonth();
    this.totalBudgetCVMForMonthsInYear = this.getTotalBudgetCVMForMonthsInYear();
    this.nichtAusgegebenesGeldCVMForMonthsInYear = this.getNichtAusgegebenesGeldCVMForMonthsInYear();
    this.ausgabenForMonatProTagKategorisiertCVM = this.getAusgabenForMonatProtagKategorisiertCVM();
  }

  update() {
    this.ausgabenProTagCVM = this.getDailyAusgabenCVMForMonth(new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    this.totalBudgetCVMForMonthsInYear = this.getTotalBudgetCVMForMonthsInYear(this.selectedYear());
    this.nichtAusgegebenesGeldCVMForMonthsInYear = this.getNichtAusgegebenesGeldCVMForMonthsInYear(this.selectedYear());
    this.ausgabenForMonatProTagKategorisiertCVM = this.getAusgabenForMonatProtagKategorisiertCVM(new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
  }

  onLayoutChanged() {
    switch (this.selectedLayout) {
      case 'Ausgaben-Verhalten für Monat':
        this.chart1 = this.getDailyAusgabenCVMForMonth();
        this.chart2 = undefined;
        this.chart3 = undefined;
        break;
      case 'Sparen-Übersicht für Jahr':
        this.chart1 = this.getTotalBudgetCVMForMonthsInYear();
        this.chart2 = this.getNichtAusgegebenesGeldCVMForMonthsInYear();
        this.chart3 = undefined;
        break;
      case '- hinzufügen -':
        console.log(3)
        break;
    }
  }

  doesMonthExist() {
    return this.dataProvider.checkIfMonthExistsForDay(new Date(this.selectedYear(), this.selectedMonthIndex(), 1))
  }

  onMonthPrevClicked() {
    if(this.selectedMonthIndex() > 0
    ) {
      this.selectedMonthIndex.set(this.selectedMonthIndex() - 1)
    } else {
      this.selectedMonthIndex.set(11);
      this.selectedYear.set(this.selectedYear() - 1);
    }
    this.update();
  }

  onMonthNextClicked() {
    if(this.selectedMonthIndex() < 11
    ) {
      this.selectedMonthIndex.set(this.selectedMonthIndex() + 1)
    } else {
      this.selectedMonthIndex.set(0);
      this.selectedYear.set(this.selectedYear() + 1);
    }
    this.update();
  }

  getDailyAusgabenCVMForMonth(date?: Date) {
    date = date ?? new Date();
    const month = this.dataProvider.getMonthByDate(date);

    let data: number[] = [];
    if(!month) {
      return {
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
      labels: Array.from({ length: month.daysInMonth! }, (_, i) => `Tag ${i + 1}`), // Labels von "Tag 1" bis "Tag 30"
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

  getTotalBudgetCVMForMonthsInYear(year?: number) {
    const data: number[] = [];

    for(let i = 0; i < 12; i++) {
      const date = new Date(year ?? new Date().getFullYear(), i, 1);
      const month = this.dataProvider.getMonthByDate(date)
      if(month) {
        data.push(month!.totalBudget ?? 0)
      } else {
        data.push(0);
      }
    }

    let chartViewModel: BarChartViewModel = {
      labels:[
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

  getNichtAusgegebenesGeldCVMForMonthsInYear(year?: number) {
    const data: number[] = [];

    for(let i = 0; i < 12; i++) {
      const date = new Date(year ?? new Date().getFullYear(), i, 1);
      const month = this.dataProvider.getMonthByDate(date)
      if(month) {
        data.push(month!.istBudget ?? 0)
      } else {
        data.push(0);
      }
    }

    let chartViewModel: BarChartViewModel = {
      labels:[
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

  getAusgabenForMonatProtagKategorisiertCVM(date?: Date) {
    const kategorien = this.dataProvider.getBuchungsKategorien();
    const month = this.dataProvider.getMonthByDate(date ?? new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    if(!month) {
      return [{
        datasets: [],
        labels: []
      }]
    }
    const alleBuchungenInMonth = this.dataProvider.getAlleBuchungenForMonth(new Date(this.selectedYear(), this.selectedMonthIndex(), 1));
    const viewModelList: BarChartViewModel[] = [];

    kategorien.forEach(kategorie => {
      const filteredBuchungen = alleBuchungenInMonth.filter(buchung => buchung.data.buchungsKategorie === kategorie.id);
      const data: number[] = []
      const labels = Array.from({ length: month.daysInMonth! }, (_, i) => `Tag ${i + 1}`);


      for(let i = 0; i < month.daysInMonth!; i++) {
        data.push(0);
      }

      filteredBuchungen.forEach(buchung => {
        data[buchung.data.date.getDate()] += buchung.data.betrag!;
      })

      const barChartViewModel: BarChartViewModel = {
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
