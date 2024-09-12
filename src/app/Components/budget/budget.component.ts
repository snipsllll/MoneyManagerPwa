import {Component, computed, OnInit, signal} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {DataService} from "../../Services/DataService/data.service";
import {BudgetInfosForMonth} from "../../Models/ClassesInterfacesEnums";

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent  implements OnInit{
  selectedMonthIndex = signal<number>(new Date().getMonth());

  selectedYear = signal<number>(new Date().getFullYear());

  data = signal<BudgetInfosForMonth>({
    budget: 0,
    dayBudget: 0,
    istBudget: 0,
    totalBudget: 0,
    sparen: 0,
    fixKosten: 0
  });

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

  constructor(public topbarService: TopbarService, private dataService: DataService) {
    this.update();
  }

  ngOnInit() {
    this.topbarService.title.set('BUDGET');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
    this.update();
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

  onSparenChanged() {
    this.dataService.changeSparenForMonth(this.getDateForSelectedMonth(), this.data().sparen);
    this.update();
  }

  onTotalBudgetChanged() {
    this.dataService.changeTotalBudgetForMonth(this.getDateForSelectedMonth(), this.data().totalBudget);
    this.update();
  }

  private getDateForSelectedMonth() {
    return new Date(this.selectedYear(), this.selectedMonthIndex(), 1);
  }

  private update() {
    this.data.set(this.dataService.getBudgetInfosForMonth(this.getDateForSelectedMonth()) ?? {
      budget: 0,
      dayBudget: 0,
      istBudget: 0,
      totalBudget: 0,
      sparen: 0,
      fixKosten: this.dataService.getFixKostenSumme()
    });
  }
}
