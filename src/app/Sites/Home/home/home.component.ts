import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {Sites} from "../../../Models/Enums";
import {NavigationService} from "../../../Services/NavigationService/navigation.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  constructor(private navigationService: NavigationService, private router: Router, private topbarService: TopbarService) {

  }

  ngOnInit() {
    this.topbarService.title.set('HOME');
    this.navigationService.previousRoute = Sites.home;
  }

  onPlusClicked() {
    this.router.navigate(['/createBuchung']);
  }
}
