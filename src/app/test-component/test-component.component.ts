import { Component } from '@angular/core';
import {environment} from "../../environments/environment";

@Component({
  selector: 'app-test-component',
  templateUrl: './test-component.component.html',
  styleUrl: './test-component.component.css'
})
export class TestComponentComponent {
  isDevelopment!: boolean;

  constructor() {}

  ngOnInit(): void {
    // Use the environment variable to set the boolean
    this.isDevelopment = !environment.production;
  }
}
