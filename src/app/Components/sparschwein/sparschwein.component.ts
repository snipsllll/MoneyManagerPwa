import {Component, OnInit} from '@angular/core';
import {TopbarService} from "../../Services/TopBarService/topbar.service";

@Component({
  selector: 'app-sparschwein',
  templateUrl: './sparschwein.component.html',
  styleUrl: './sparschwein.component.css'
})
export class SparschweinComponent implements OnInit{

  constructor(private topbarService: TopbarService) {
  }

  ngOnInit() {
    this.topbarService.title.set('SPARSCHWEIN');
    this.topbarService.dropDownSlidIn.set(false);
    this.topbarService.isDropDownDisabled = true;
  }

  onPlusClicked() {

  }
}
