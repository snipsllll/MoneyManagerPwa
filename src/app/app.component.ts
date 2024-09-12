import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "./Services/DialogService/dialog.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'MoneyManagerPwa';

  constructor(private router: Router, public dialogService: DialogService) {
  }

  ngOnInit() {
    this.router.navigate(['/'])
  }

}
