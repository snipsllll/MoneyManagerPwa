import {Component, OnInit} from '@angular/core';
import {NavigationService} from "../../Services/NavigationService/navigation.service";
import {Router} from "@angular/router";
import {DataService} from "../../Services/DataService/data.service";
import {TopbarService} from "../../Services/TopBarService/topbar.service";
import {Sites} from "../../Models/ClassesInterfacesEnums";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  constructor(private navigationService: NavigationService, private router: Router, private dataService: DataService, private topbarService: TopbarService) {

  }

  ngOnInit() {
    this.topbarService.title.set('HOME');
    this.navigationService.previousRoute = Sites.home;
  }

  onPlusClicked() {
    this.router.navigate(['/createBuchung']);
  }
}
