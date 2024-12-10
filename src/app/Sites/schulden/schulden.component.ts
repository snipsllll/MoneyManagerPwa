import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";

@Component({
  selector: 'app-schulden',
  templateUrl: './schulden.component.html',
  styleUrl: './schulden.component.css'
})
export class SchuldenComponent implements OnInit{

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('SCHULDEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

}
