import {Component, computed, OnInit} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {SideNavService} from "../../Services/SideNavService/side-nav.service";
import {Router} from "@angular/router";
import {UT} from "../../Models/Classes/UT";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {TopBarBudgetOptions} from "../../Models/Enums";

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  styleUrl: './top-bar.component.css'
})
export class TopBarComponent implements OnInit {

  title?: string;
  availableMoney = computed(() => {
    this.dataService.updated();
    return this.dataProvider.getAvailableMoney(new Date())
  })

  availableMoneyCapped = computed(() => {
    this.dataService.updated();
    return this.dataProvider.getAvailableMoneyCapped(new Date())
  })

  ut: UT = new UT();

  constructor(public dataProvider: DataProviderService, private router: Router, private dataService: DataService, public topbarService: TopbarService, public sideNavService: SideNavService) {

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

  getDaysLeftText() {
    const daysLeft = this.dataProvider.getAnzahlDaysLeftForMonth(new Date());
    return daysLeft === 1
      ? "für 1 Tag"
      : `für ${daysLeft} Tage`
  }

  getSelectedtTopBarBudget() {
    switch (this.dataProvider.getSettings().topBarAnzeigeEinstellung) {
      case TopBarBudgetOptions.monat:
        return this.ut.toFixedDown(this.availableMoney()!.availableForMonth, 2);
        break;
      case TopBarBudgetOptions.woche:
        return this.ut.toFixedDown(this.availableMoney()!.availableForWeek, 2);
        break;
      case TopBarBudgetOptions.tag:
        return this.ut.toFixedDown(this.availableMoney()!.availableForDay, 2);
        break;
      default:
        return undefined;
        break;
    }
  }

  getSelectedtTopBarBudgetCapped() {
    switch (this.dataProvider.getSettings().topBarAnzeigeEinstellung) {
      case TopBarBudgetOptions.monat:
        return this.ut.toFixedDown(this.availableMoneyCapped()!.availableForMonth, 2);
        break;
      case TopBarBudgetOptions.woche:
        return this.ut.toFixedDown(this.availableMoneyCapped()!.availableForWeek, 2);
        break;
      case TopBarBudgetOptions.tag:
        return this.ut.toFixedDown(this.availableMoneyCapped()!.availableForDay, 2);
        break;
      default:
        return undefined;
        break;
    }
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

  protected readonly TopBarBudgetOptions = TopBarBudgetOptions;
}
