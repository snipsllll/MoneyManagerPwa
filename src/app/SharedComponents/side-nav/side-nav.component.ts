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
    console.log(this.route.snapshot.url.length)
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
      }
    }
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

  onEinstellungenClicked() {
    this.router.navigate(['einstellungen']);
    this.topbarService.isSlidIn.set(false);
    this.sideNavService.selectedElement = SideNavElements.einstellungen;
  }
}
