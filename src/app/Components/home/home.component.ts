import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  constructor(private navigationService: NavigationService, private router: Router, private dataService: DataService, private topbarService: TopbarService) {

  }

  ngOnInit() {
    this.topbarService.title.set('HOME');
    this.navigationService.previousRoute = Sites.home;
  }

  onPlusClicked() {
    this.router.navigate(['/createBuchung']);
  }
}
