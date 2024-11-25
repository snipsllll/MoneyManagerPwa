import {Component, OnInit} from '@angular/core';
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

  ausgabenProTagCVM!: BarChartViewModel;
  totalBudgetCVMForMonthsInYear!: BarChartViewModel;
  nichtAusgegebenesGeldCVMForMonthsInYear!: BarChartViewModel;

  constructor(private dataProvider: DataProviderService, private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('AUSWERTUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.ausgabenProTagCVM = this.getDailyAusgabenCVMForMonth();
    this.totalBudgetCVMForMonthsInYear = this.getTotalBudgetCVMForMonthsInYear();
    this.nichtAusgegebenesGeldCVMForMonthsInYear = this.getNichtAusgegebenesGeldCVMForMonthsInYear();
  }

  getDailyAusgabenCVMForMonth(date?: Date) {
    date = date ?? new Date();
    const month = this.dataProvider.getMonthByDate(date);

    let data: number[] = [];

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
      labels: Array.from({ length: 30 }, (_, i) => `Tag ${i + 1}`), // Labels von "Tag 1" bis "Tag 30"
      datasets: [
        {
          label: 'Ausgaben pro Tag',
          data: data,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Grünlich
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
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Grünlich
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
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Grünlich
        }
      ],
    };

    return chartViewModel;
  }
}
