import {Component, computed, Input, OnInit, signal} from '@angular/core';
import {IBuchungenlistMonth} from "../../../Models/NewInterfaces";
import {DataProviderService} from "../../../Services/DataProviderService/data-provider.service";
import {DataService} from "../../../Services/DataService/data.service";
import {UT} from "../../../Models/Classes/UT";

@Component({
  selector: 'app-buchungen-list-month',
  templateUrl: './buchungen-list-month.component.html',
  styleUrl: './buchungen-list-month.component.css'
})
export class BuchungenListMonthComponent implements OnInit {
  @Input() month!: IBuchungenlistMonth;
  ut: UT = new UT();

  isMonthVisible = signal<boolean>(false);
  monthBudget = computed(() => {
    this.dataService.updated();
    return this.dataProvider.getBudgetInfosForMonth(this.month.days[0].date)?.istBudget;
  })

  constructor(private dataService: DataService, private dataProvider: DataProviderService) {

  }

  ngOnInit() {
    this.isMonthVisible.set(this.month.isVisible);
  }

  toggleIsMonthVisible() {
    this.isMonthVisible.set(!this.isMonthVisible());
  }

  onShowMonthClicked() {
    this.isMonthVisible.set(true);
  }

  onHideMonthClicked() {
    this.isMonthVisible.set(false);
  }
}
