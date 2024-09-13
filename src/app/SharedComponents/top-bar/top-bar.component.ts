import {Component, computed, OnInit} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {SideNavService} from "../../Services/SideNavService/side-nav.service";
import {DayIstBudgetViewModel} from "../../Models/ViewModels/DayIstBudgetViewModel";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent  implements OnInit{
  title?: string;
  dayBudget = computed(() => {
    this.dataService.updated();
    const x = this.dataService.getDayIstBudgets(new Date());
    const y: DayIstBudgetViewModel = {
      month: x?.monthIstBudget,
      week: x?.weekIstBudget,
      day: x?.dayIstBudget,
      leftOvers: x?.leftOvers,
      gespartes: x?.gespartes,
      verfuegbar: +((x?.leftOvers! ?? 0) + (x?.dayIstBudget! ?? 0)).toFixed(2)
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
    console.log(this.dataService.userData.months())
  }
}
