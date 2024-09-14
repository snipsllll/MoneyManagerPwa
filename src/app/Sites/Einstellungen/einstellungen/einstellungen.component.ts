import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../../../Services/TopBarService/topbar.service";

@Component({
  selector: 'app-einstellungen',
  templateUrl: './einstellungen.component.html',
  styleUrl: './einstellungen.component.css'
})
export class EinstellungenComponent implements OnInit{

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('EINSTELLUNGEN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

}
