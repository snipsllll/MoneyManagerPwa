import { Component } from '@angular/core';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent {
  title?: string;
  monthIstBudget = computed(() => {
    this.dataService.updated();
    const x = this.dataService.getDayIstBudgets(new Date());
    const y: DayIstBudgetViewModel = {
      month: x?.monthIstBudget?.toString() ?? '???',
      week: x?.weekIstBudget?.toString() ?? '???',
      day: x?.dayIstBudget?.toString() ?? '???',
    };
    return y;
  })

  constructor(private dataService: DataService, public topbarService: TopbarService, public sideNavService: SideNavService) {

  }

  ngOnInit() {
    this.title = this.topbarService.title();
  }

  onMenuButtonClicked() {
    this.topbarService.isSlidIn.set(!this.topbarService.isSlidIn());
  }

  toggleDropdown(){
    if(!this.topbarService.isDropDownDisabled)
      this.topbarService.dropDownSlidIn.set(!this.topbarService.dropDownSlidIn());
  }

  test() {
    console.log(this.dataService.userData)
  }
}
