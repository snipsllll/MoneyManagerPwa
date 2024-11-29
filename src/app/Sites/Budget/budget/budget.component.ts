import {Component, computed, OnInit, signal} from '@angular/core';
import {BudgetInfosForMonth} from "../../../Models/Interfaces";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {DataService} from "../../../Services/DataService/data.service";
import {UT} from "../../../Models/Classes/UT";
import {DataChangeService} from "../../../Services/DataChangeService/data-change.service";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {DialogService} from "../../../Services/DialogService/dialog.service";
import {
  MonatFixkostenDialogData,
  MonatFixkostenDialogViewModel
} from "../../../Models/ViewModels/MonatFixkostenDialogViewModel";

@Component({
  selector: 'app-budget',
  templateUrl: './budget.component.html',
  styleUrl: './budget.component.css'
})
export class BudgetComponent  implements OnInit{
  ut: UT = new UT();

  selectedMonthIndex = signal<number>(new Date().getMonth());

  selectedYear = signal<number>(new Date().getFullYear());

  isFixkostenDetailsVisible = signal<boolean>(false);
  isgeplanteAusgabenDetailsVisible = signal<boolean>(false);

  data = signal<BudgetInfosForMonth>({
    budget: 0,
    dayBudget: 0,
    istBudget: 0,
    totalBudget: 0,
    sparen: 0,
    fixKostenSumme: 0
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

  constructor(private dialogService: DialogService, public dataProvider: DataProviderService, private dataChangeService: DataChangeService, public topbarService: TopbarService, protected dataService: DataService) {
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
    this.dataChangeService.changeSparenBetragForMonth(this.getDateForSelectedMonth(), this.data().sparen);
    this.update();
  }

  onTotalBudgetChanged() {
    this.dataChangeService.changeTotalBudgetBetragForMonth(this.getDateForSelectedMonth(), this.data().totalBudget);
    this.update();
  }

  onFixKostenClicked() {
    this.isFixkostenDetailsVisible.set(!this.isFixkostenDetailsVisible());
  }

  onGeplanteAusgabenClicked() {
    this.isgeplanteAusgabenDetailsVisible.set(!this.isgeplanteAusgabenDetailsVisible());
  }

  getStartdateForSelectedMonth() {
    return new Date(this.selectedYear(), this.selectedMonthIndex(), 1);
  }

  getTodayDate() {
    return new Date();
  }

  onFixkostenEditClicked() {
    const viewModel: MonatFixkostenDialogViewModel = {
      elemente: this.getFixkostenDialogElements(),
      onAbortClicked: this.onFixkostenAbortClicked,
      onSaveClicked: this.onFixkostenSaveClicked,
      summeLabel: 'Summe:'
    }
    this.dialogService.showMonatFixkostenDialog(viewModel);
  }

  onGeplanteAusgabenEditClicked() {
    const viewModel: MonatFixkostenDialogViewModel = {
      elemente: this.getGeplanteAusgabenDialogElements(),
      onAbortClicked: this.onGeplanteAusgabenAbortClicked,
      onSaveClicked: this.onGeplanteAusgabenSaveClicked,
      summeLabel: 'Summe:'
    }
    this.dialogService.showMonatFixkostenDialog(viewModel);
  }

  getFixkostenDialogElements() {
    return this.dataProvider.getFixkostenEintraegeForMonth(this.getStartdateForSelectedMonth()) ?? [];
  }

  getGeplanteAusgabenDialogElements() {
    return this.dataProvider.getGeplanteAusgabenEintraegeForMonth(this.getStartdateForSelectedMonth()) ?? [];
  }

  onFixkostenAbortClicked = () => {
    this.dialogService.isMonatFixkostenDialogVisible = false;
  }

  onFixkostenSaveClicked = (data: MonatFixkostenDialogData) => {
    this.dataChangeService.editFixkostenEintraegeForMonth(this.getStartdateForSelectedMonth(), data.elemente);
    this.dialogService.isMonatFixkostenDialogVisible = false;
    this.update();
  }

  onGeplanteAusgabenAbortClicked = () => {
    this.dialogService.isMonatFixkostenDialogVisible = false;
  }

  onGeplanteAusgabenSaveClicked = (data: MonatFixkostenDialogData) => {
    this.dataChangeService.editGeplanteAusgabenEintraegeForMonth(this.getStartdateForSelectedMonth(), data.elemente);
    this.dialogService.isMonatFixkostenDialogVisible = false;
    this.update();
  }

  private getDateForSelectedMonth() {
    return new Date(this.selectedYear(), this.selectedMonthIndex(), 1);
  }

  private update() {
    this.data.set(this.dataProvider.getBudgetInfosForMonth(this.getDateForSelectedMonth()) ?? {
      budget: 0,
      dayBudget: 0,
      istBudget: 0,
      totalBudget: 0,
      sparen: 0,
      fixKostenSumme: this.dataProvider.getFixkostenSummeForMonth({
        startDate: new Date(this.selectedYear(), this.selectedMonthIndex())
      }),
      geplanteAusgabenSumme: this.dataProvider.getGeplanteAusgabenSummeForMonth({
        startDate: new Date(this.selectedYear(), this.selectedMonthIndex())
      })
    });
  }
}
