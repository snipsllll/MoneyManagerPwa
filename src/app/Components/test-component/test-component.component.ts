import { Component } from '@angular/core';
import {environment} from "../../../environments/environment";
import {DataService} from "../../Services/DataService/data.service";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.css'
})
export class TestComponentComponent {
  isDevelopment!: boolean;

  x= '';

  constructor(private dataService: DataService) {
    ;
  }

  ngOnInit(): void {
    // Use the environment variable to set the boolean
    this.isDevelopment = !environment.production;
  }
}
