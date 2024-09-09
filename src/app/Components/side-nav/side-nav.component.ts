import { Component } from '@angular/core';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {
  constructor(private router: Router, public topbarService: TopbarService, public sideNavService: SideNavService) {

  }

  onHomeClicked(): void {
    this.router.navigate(['']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.home;
  }

  onBudgetClicked(): void {
    this.router.navigate(['budget']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.budget;
  }

  onFixKostenClicked(): void {
    this.router.navigate(['fixKosten']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.fixkosten;
  }
}
