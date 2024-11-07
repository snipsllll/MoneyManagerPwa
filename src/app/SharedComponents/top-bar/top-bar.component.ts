import {Component, computed, OnInit} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {SideNavService} from "../../Services/SideNavService/side-nav.service";
import {DayIstBudgetViewModel} from "../../Models/ViewModels/DayIstBudgetViewModel";
import {Router} from "@angular/router";
import {UT} from "../../Models/Classes/UT";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {

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
      verfuegbar: +((x?.leftOvers! ?? 0) + (x?.dayIstBudget! ?? 0))
    };
    return y;
  })
  ut: UT = new UT();

  constructor(private router: Router, private dataService: DataService, public topbarService: TopbarService, public sideNavService: SideNavService) {

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

  private pressTimer: any;
  private holdTime: number = 5000; // 5 Sekunden

  // Funktion wird aufgerufen, wenn der Touch-Event startet
  onTouchStart() {
    // Starte den Timer für 5 Sekunden
    this.pressTimer = setTimeout(() => {
      this.router.navigate(['spinning-fish'])
    }, this.holdTime);
  }

  // Funktion wird aufgerufen, wenn der Touch-Event endet
  onTouchEnd() {
    // Timer abbrechen, wenn der Button nicht 5 Sekunden lang gedrückt wurde
    clearTimeout(this.pressTimer);
  }
}
