import { Component } from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {Router} from "@angular/router";
import {SideNavService} from "../../Services/SideNavService/side-nav.service";
import {SideNavElements} from "../../Models/Enums";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent {

  protected readonly SideNavElements = SideNavElements;

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

  onSparscheinClicked() {
    this.router.navigate(['sparschwein']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.sparschwein;
  }

  onWunschlisteClicked() {
    this.router.navigate(['wunschliste']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.wunschliste;
  }
}
