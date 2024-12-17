import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {TopbarService} from "../../../Services/TopBarService/topbar.service";
import {Sites} from "../../../Models/Enums";
import {NavigationService} from "../../../Services/NavigationService/navigation.service";
import {AdminService} from "../../../admin.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent  implements OnInit{
  isDataLoading = true;

  constructor(private adminService: AdminService, private navigationService: NavigationService, private router: Router, private topbarService: TopbarService) {
    this.adminService.isDataLoading.subscribe(isLoading => {
      console.log(isLoading);
      this.isDataLoading = isLoading;
    })
  }

  ngOnInit() {
    this.topbarService.title.set('HOME');
    this.topbarService.isDropDownDisabled = false;
    this.navigationService.previousRoute = Sites.home;
  }

  onPlusClicked() {
    this.router.navigate(['/createBuchung']);
  }
}
