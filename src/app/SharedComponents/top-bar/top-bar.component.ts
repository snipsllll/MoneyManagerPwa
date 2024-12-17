import {Component, computed, OnInit} from '@angular/core';
import {DataService} from "../../Services/DataService/data.service";
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {SideNavService} from "../../Services/SideNavService/side-nav.service";
import {Router} from "@angular/router";
import {UT} from "../../Models/Classes/UT";
import {DataProviderService} from "../../Services/DataProviderService/data-provider.service";
import {TopBarBudgetOptions} from "../../Models/Enums";
import {versionName} from "../../Models/Classes/versionName";
import {AdminService} from "../../admin.service";

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

  constructor(private adminService: AdminService, public dataProvider: DataProviderService, private router: Router, private dataService: DataService, public topbarService: TopbarService, public sideNavService: SideNavService) {

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

  isDropdownEnabled() {
    if(this.title === 'EINSTELLUNGEN')
      return false;
    if(this.title === 'WUNSCHLISTE')
      return false;
    if(this.title === 'SPARSCHWEIN')
      return false;
    if(this.title === 'AUSWERTUNGEN')
      return false;
    if(this.availableMoney().noData)
      return false;
    if(this.dataProvider.getSettings().topBarAnzeigeEinstellung === TopBarBudgetOptions.leer)
      return false;

    return true
  }

  getDaysLeftText(): string | undefined {
    switch (this.dataProvider.getSettings().topBarAnzeigeEinstellung) {
      case TopBarBudgetOptions.monat:
        return 'für diesen Monat';
        break;
      case TopBarBudgetOptions.woche:
        return 'für diese Woche';
        break;
      case TopBarBudgetOptions.tagSoll:
        return 'für Heute (soll)';
        break;
      case TopBarBudgetOptions.tagIst:
        return 'für Heute (ist)';
        break;
      default:
        return undefined;
        break;
    }
    /*
    const daysLeft = this.dataProvider.getAnzahlDaysLeftForMonth(new Date());
    return daysLeft === 1
      ? "für 1 Tag"
      : `für ${daysLeft} Tage`*/
  }

  getSelectedtTopBarBudget() {
    switch (this.dataProvider.getSettings().topBarAnzeigeEinstellung) {
      case TopBarBudgetOptions.monat:
        return this.ut.toFixedDown(this.availableMoney()!.availableForMonth, 2);
        break;
      case TopBarBudgetOptions.woche:
        return this.ut.toFixedDown(this.availableMoney()!.availableForWeek, 2);
        break;
      case TopBarBudgetOptions.tagIst:
        return this.ut.toFixedDown(this.availableMoney()!.availableForDayIst, 2);
        break;
      case TopBarBudgetOptions.tagSoll:
        return this.ut.toFixedDown(this.availableMoney()!.availableForDaySoll, 2);
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
      case TopBarBudgetOptions.tagIst:
        return this.ut.toFixedDown(this.availableMoneyCapped()!.availableForDayIst, 2);
        break;
      case TopBarBudgetOptions.tagSoll:
        return this.ut.toFixedDown(this.availableMoneyCapped()!.availableForDaySoll, 2);
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
  protected readonly versionName = versionName;
}
