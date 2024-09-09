import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {FileServiceService} from "./fileService/file-service.service";
import {DataService} from "./Services/DataService/data.service";
import {DialogService} from "./Services/DialogService/dialog.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'MoneyManagerPwa';

  constructor(private dataService: DataService, private router: Router, public dialogService: DialogService) {
  }

  ngOnInit() {
    this.router.navigate(['/'])
  }

}
