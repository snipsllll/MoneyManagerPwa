import { Injectable } from '@angular/core';
import {Sites} from "../../Models/Enums";

@Injectable({
  providedIn: 'root'
})

export class NavigationService {

  previousRoute: Sites = Sites.home;
  param1: string = '';
  param2: string = '';

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
        route = `/buchungDetails/${this.param1}/${this.param2}`;
        console.log(route)
        break;
      case Sites.editBuchung:
        route = `/editBuchung/${this.param1}/${this.param2}`;
        console.log(route)
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

