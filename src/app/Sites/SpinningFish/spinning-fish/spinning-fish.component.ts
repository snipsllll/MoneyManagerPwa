import { Component } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-spinning-fish',
  templateUrl: './spinning-fish.component.html',
  styleUrl: './spinning-fish.component.css'
})
export class SpinningFishComponent {
  constructor(private router: Router) {
  }

  onFishClicked() {
    this.router.navigate(['/']);
  }
}
