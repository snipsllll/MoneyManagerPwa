import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  previousRoute: Sites = Sites.home;
  param: string = '';

  constructor() { }

  getBackRoute() {
    let route = '';
    switch (this.previousRoute) {
      case Sites.home:
        route = '/';
        break;
      case Sites.budget:
        route = '/budget';
        break;
      case Sites.buchungDetails:
        route = `/buchungDetails/${this.param}`;
        break;
      case Sites.editBuchung:
        route = `/editBuchung/${this.param}`;
        break;
      case Sites.createBuchung:
        route = '/createBuchung';
        break;
      case Sites.fixKosten:
        route = '/fixKosten';
        break;
    }
    return route;
  }
}

