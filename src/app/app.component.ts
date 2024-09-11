import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {DialogService} from "./Services/DialogService/dialog.service";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  title = 'MoneyManagerPwa';
  inProduction = environment.production

  constructor(private router: Router, public dialogService: DialogService) {
  }

  ngOnInit() {
    if(this.inProduction)
    this.router.navigate(['/'])
  }

}
