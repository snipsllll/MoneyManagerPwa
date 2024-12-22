import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {ActivatedRoute, Router} from "@angular/router";
import {SideNavService} from "../../Services/SideNavService/side-nav.service";
import {SideNavElements} from "../../Models/Enums";

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrl: './side-nav.component.css'
})
export class SideNavComponent implements OnInit{

  protected readonly SideNavElements = SideNavElements;

  constructor(private router: Router,private route: ActivatedRoute, public topbarService: TopbarService, public sideNavService: SideNavService) {

  }

  ngOnInit() {
    if(this.route.snapshot.url.length === 0){
      this.sideNavService.selectedElement = SideNavElements.home;
    } else {
      switch(this.route.snapshot.url[0].path) {
        case 'budget':
          this.sideNavService.selectedElement = SideNavElements.budget;
          break;
        case 'fixkosten':
          this.sideNavService.selectedElement = SideNavElements.fixkosten;
          break;
        case 'sparschwein':
          this.sideNavService.selectedElement = SideNavElements.sparschwein;
          break;
        case 'wunschliste':
          this.sideNavService.selectedElement = SideNavElements.wunschliste;
          break;
        case 'einstellungen':
          this.sideNavService.selectedElement = SideNavElements.einstellungen;
          break;
        case 'auswertungen':
          this.sideNavService.selectedElement = SideNavElements.auswertungen;
          break;
        case 'schulden':
          this.sideNavService.selectedElement = SideNavElements.schulden;
          break;
      }
    }
  }

  onHomeClicked(): void {
    this.router.navigate(['home']);
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

  onSchuldenClicked(): void {
    this.router.navigate(['schulden']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.schulden;
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

  onAuswertungenClicked() {
    this.router.navigate(['auswertungen']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.auswertungen;
  }

  onEinstellungenClicked() {
    this.router.navigate(['einstellungen']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.einstellungen;
  }
}
